import { db } from "../database/database.connection.js";
import { customerSchema } from "../schemas/customers.shema.js";

export async function validateCustomer(req, res, next) {
  // req.body is the customer object

  const { error } = customerSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map((err) => err.message);
    return res.status(400).send(errors);
  }

  // if merhod is PUT, check if customer exists
  if (req.method === "PUT") {
    res.locals.customer = req.body;
    return next();
  }

  const cpfExists = await db.query("SELECT * FROM customers WHERE cpf = $1", [
    req.body.cpf,
  ]);
  if (cpfExists.rowCount > 0) {
    return res.status(409).send("Customer already exists");
  }

  res.locals.customer = req.body;
  next();
}

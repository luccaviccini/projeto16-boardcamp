import { db } from "../database/database.connection.js";
import { customerSchema } from "../schemas/customers.schema.js";

export async function validateCustomer(req, res, next) {
  // req.body is the customer object

  const { error } = customerSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map((err) => err.message);
    return res.status(400).send(errors);
  }


  if(req.method === "POST") {
    const cpfExists = await db.query(
      "SELECT * FROM customers WHERE cpf = $1",
      [req.body.cpf]
    );
    if (cpfExists.rowCount !== 0) {
      return res.status(409).send("CPF already exists");
    }
  }
  if(req.method === "PUT"){
    const cpfExists = await db.query(
      "SELECT * FROM customers WHERE cpf = $1 AND id <> $2",
      [req.body.cpf, req.params.id]
    );
    if (cpfExists.rowCount !== 0) {
      return res.status(409).send("CPF already exists");
    }
  } 


  res.locals.customer = req.body;
  next();
}

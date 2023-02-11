import { db } from "../database/database.connection.js";
import { rentalSchema } from "../schemas/rentals.schemas.js";

export async function validateRental(req, res, next) {
  // req.body is the rental object

  

  const { customerId, gameId, daysRented  } = req.body;
  console.log("req.body: ", req.body)

  const { error } = rentalSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map((err) => err.message);
    return res.status(400).send(errors);
  }

  const gameExists = await db.query(
    "SELECT * FROM games WHERE id = $1",
    [gameId]
  );
  if (gameExists.rowCount === 0) {
    return res.status(404).send("Game not found");
  }

  const customerExists = await db.query(
    "SELECT * FROM customers WHERE id = $1",
    [customerId]
  );
  if (customerExists.rowCount === 0) {
    return res.status(404).send("Customer not found");
  }

  const rentals = await db.query(
    `SELECT * FROM rentals WHERE "gameId" = $1`, [gameExists.rows[0].id]
  );

  if(rentals.rows.length > gameExists.rows[0].stockTotal) {
    return res.status(400).send("Game is not available");
  }


  res.locals.pricePerDay = gameExists.rows[0].pricePerDay;
  console.log("res.locals.game: ", res.locals.pricePerDay);
  res.locals.rental = req.body;
  
  next();
}
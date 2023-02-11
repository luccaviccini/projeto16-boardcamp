import { db } from "../database/database.connection.js";

export async function createRental(req, res) {
  const { customerId, gameId, daysRented } = res.locals.rental;
  const pricePerDay = res.locals.pricePerDay;
  console.log("TO CHEGANDO AQUI: ", pricePerDay);

  const rentalObject = {
    customerId,
    gameId,
    daysRented,
    rentDate: new Date(),
    originalPrice: pricePerDay * daysRented,
    returnDate: null,
    delayFee: null,
  };

  try {
    await db.query(
      `INSERT INTO rentals ("customerId","gameId","daysRented", "rentDate", "originalPrice", "returnDate", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        rentalObject.customerId,
        rentalObject.gameId,
        rentalObject.daysRented,
        rentalObject.rentDate,
        rentalObject.originalPrice,
        rentalObject.returnDate,
        rentalObject.delayFee,
      ]
    );
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

// get All rentals

export async function readRentals(req, res) {
  const { customerId, gameId } = req.query;

  // global query that ele
  let query = `SELECT
    rental_game_customer.id,
    rental_game_customer."customerId",
    rental_game_customer."gameId",
    rental_game_customer."rentDate",
    rental_game_customer."daysRented",
    rental_game_customer."returnDate",
    rental_game_customer."originalPrice",
    rental_game_customer."delayFee",
    json_build_object('id', rental_game_customer.customer_id, 'name', rental_game_customer.customer_name) AS customer,
    json_build_object('id', rental_game_customer.game_id, 'name', rental_game_customer.game_name) AS game
  FROM (
    SELECT
      rentals.id,
      rentals."customerId",
      rentals."gameId",
      rentals."rentDate",
      rentals."daysRented",
      rentals."returnDate",
      rentals."originalPrice",
      rentals."delayFee",
      customers.id AS customer_id,
      customers.name AS customer_name,
      games.id AS game_id,
      games.name AS game_name
    FROM rentals
    JOIN customers ON rentals."customerId" = customers.id
    JOIN games ON rentals."gameId" = games.id
  ) AS rental_game_customer;`;

  try {
    const rentals = await db.query(query);
    console.log("RENTALS: ", rentals.rows)
    res.send(rentals.rows);
  } catch (error) {
    res.status(500).send("Error getting rentals");
  }
}

// delete rental

export async function deleteRental(req, res) {
  const { id } = req.params;
  console.log("ID: ", id);

  try {
    const result = await db.query(`SELECT * FROM rentals WHERE id = $1`, [id]);
    //VERIFICANDO SE O ID  EXISTE
    if (result.rowCount === 0) {
      return res.sendStatus(404);
    }
    //VERIFICANDO SE O ALUGUEL JÁ FOI FINALIZADO
    console.log("RESULT: ", result.rows[0]);
    if (!result.rows[0].returnDate) {
      return res.sendStatus(400);
    }

    await db.query(`DELETE FROM rentals WHERE id = $1`, [id]);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send("Error deleting rental");
  }
}

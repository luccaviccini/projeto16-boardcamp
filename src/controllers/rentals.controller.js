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

export async function finalizeRental(req, res) {
  const rentalId = req.params.id;
  const todaysDate = new Date().toISOString().split("T")[0];
  let gameRental;

  try {
    const rentalQueryResult = await db.query(
      `SELECT * FROM rentals WHERE id = $1`,
      [rentalId]
    );
    if (!rentalQueryResult.rows.length) {
      return res.status(404).send("Rental not found!");
    }

    gameRental = rentalQueryResult.rows[0];
    if (gameRental.returnDate !== null) {
      return res.status(400).send("Rental already returned!");
    }

    const rentDate = new Date(gameRental.rentDate);
    const returnDate = new Date(todaysDate);
    const timeDiff = Math.abs(returnDate.getTime() - rentDate.getTime());
    const differenceInDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const daysRented = gameRental.daysRented;
    const returnDelay = differenceInDays - daysRented;

    let delayFee = 0;
    if (returnDelay > 0) {
      const gameQueryResult = await db.query(
        `SELECT * FROM games WHERE id = $1`,
        [gameRental.gameId]
      );

      delayFee = returnDelay * gameQueryResult.rows[0].pricePerDay;
    }

    // UPDATING rentals TABLE
    await db.query(
      `UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3`,
      [todaysDate, delayFee, rentalId]
    );

    res.status(200).send("Rental finalized!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error finalizing rental");
  }
}

// delete rental

export async function deleteRental(req, res) {
  const { id } = req.params;
  console.log("ID: ", id);

  try {
    const result = await db.query(`SELECT * FROM rentals WHERE id = $1`, [id]);
    if (result.rowCount === 0) {
      return res.sendStatus(404);
    }
    console.log("RESULT: ", result.rows[0]);
    if (!result.rows[0].returnDate) {
      return res.status(400).send("Rental has not been returned yet");
    }

    await db.query(`DELETE FROM rentals WHERE id = $1`, [id]);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting rental");
  }
}


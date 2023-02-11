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
  let query = `SELECT json_build_object(
    'id', rentals.id,
    'customerId', rentals."customerId",
    'gameId', rentals."gameId",
    'rentDate', rentals."rentDate",
    'daysRented', rentals."daysRented",
    'returnDate', rentals."returnDate",
    'originalPrice', rentals."originalPrice",
    'delayFee', rentals."delayFee",
    'customer', json_build_object(
        'id', customers.id,
        'name', customers.name
    ),
    'game', json_build_object(
        'id', games.id,
        'name', games.name
    )
  ) AS result
    FROM rentals
    JOIN customers ON rentals."customerId" = customers.id
    JOIN games ON rentals."gameId" = games.id;`;

  try {
    const rentals = await db.query(query);
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

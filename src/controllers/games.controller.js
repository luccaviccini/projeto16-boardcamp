import {db} from '../database/database.connection.js';

export async function createGame(req, res) {
  const { name, image, stockTotal, pricePerDay } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4) RETURNING *',
      [name, image, stockTotal, pricePerDay]
    );

    res.status(201).send(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function readGames(req, res) {
  try {
    const result = await db.query('SELECT * FROM games');

    res.send(result.rows);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
import { gameSchema } from '../schemas/games.schema.js';
import db from '../database/database.connection.js';

export async function validateGame(req, res, next) {

  const { error } = gameSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((err) => err.message);
    return res.status(400).send(errors);
  }

  const nameExists = await db.query('SELECT * FROM games WHERE name = $1', [req.body.name]);
  if (nameExists.rowCount > 0) {
    return res.status(409).send('Game already exists');
  }

  res.locals.game = req.body; // req.body is the game object
  next();
}
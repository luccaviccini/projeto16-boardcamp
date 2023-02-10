import { db } from '../database/database.connection.js';

export async function createCustomer(req, res) {

  const { name, phone, cpf, birthday } = res.locals.customer;

  try {
    const result = await db.query(
      'INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, phone, cpf, birthday]
    );

    res.status(201).send(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function readCustomers(req, res) {
  
  try {       
    const result = await db.query('SELECT * FROM customers');
    res.send(result.rows);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function readCustomerById(req, res) {
  const { id } = req.params;

  try {
    const result = await db.query('SELECT * FROM customers WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.sendStatus(404);
    }

    res.send(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function updateCustomer(req, res) {
  const { id } = req.params;
  const { name, phone, cpf, birthday } = req.body;

  try {
    const result = await db.query(
      'UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5 RETURNING *',
      [name, phone, cpf, birthday, id]
    );

    if (result.rowCount === 0) {
      return res.sendStatus(404);
    }

    res.send(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
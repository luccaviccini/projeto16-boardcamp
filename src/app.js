import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import gamesRouter from "./routers/games.router.js";
import customersRouter from "./routers/customers.router.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(gamesRouter);
app.use(customersRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`);
});
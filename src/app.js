import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`);
});
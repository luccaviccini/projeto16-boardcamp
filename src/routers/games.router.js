import { Router } from "express";
import { createGame, readGames } from "../controllers/games.controller.js";
import { validateGame } from "../middlewares/games.middleware.js";




const router = Router();

router.post("/games", validateGame, createGame);
router.get("/games", readGames);  


export default router;
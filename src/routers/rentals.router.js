import { Router } from "express";

import {createRental} from "../controllers/rentals.controller.js";
import {validateRental} from "../middlewares/rentals.middleware.js";

const router = Router();

router.post("/rentals", validateRental, createRental);

export default router;


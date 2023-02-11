import { Router } from "express";

import {createRental, deleteRental} from "../controllers/rentals.controller.js";
import {validateRental} from "../middlewares/rentals.middleware.js";


const router = Router();

router.post("/rentals", validateRental, createRental);
router.delete("/rentals/:id", deleteRental);

export default router;


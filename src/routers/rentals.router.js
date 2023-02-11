import { Router } from "express";

import {
  createRental,
  readRentals,
  finalizeRental,
  deleteRental,
} from "../controllers/rentals.controller.js";
import {validateRental} from "../middlewares/rentals.middleware.js";


const router = Router();

router.post("/rentals", validateRental, createRental);
router.get("/rentals", readRentals);
router.post("/rentals/:id/return", finalizeRental);
router.delete("/rentals/:id", deleteRental);

export default router;


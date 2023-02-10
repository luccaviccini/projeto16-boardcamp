import { Router } from "express";
import {
  createCustomer,
  readCustomers,
  updateCustomer,
  readCustomerById,
} from "../controllers/customers.controller.js";
import { validateCustomer } from "../middlewares/customers.middleware.js";

const router = Router();

router.post("/customers", validateCustomer, createCustomer);
router.put("/customers/:id", validateCustomer, updateCustomer);
router.get("/customers", readCustomers);
router.get("/customers/:id", readCustomerById);

export default router;

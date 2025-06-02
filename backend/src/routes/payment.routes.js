import express from "express";
import {
  createPayment,
  updatePaymentStatus,
  getAllpayment,
  getUserPayment,
  getPaymentById,
} from "../controllers/paymentContoller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";
const paymentRouter = express.Router();

paymentRouter.post("/", authMiddleware, createPayment);
paymentRouter.put("/:id", authMiddleware, updatePaymentStatus);
paymentRouter.get("/", authMiddleware, roleMiddleware("admin"), getAllpayment);
paymentRouter.get("/user", authMiddleware, getUserPayment);
paymentRouter.get("/:id", authMiddleware, getPaymentById);

export default paymentRouter;

import express from "express";
import {
  createBooking,
  deleteBooking,
  getBookingByTrainer,
  getBookingByuser,
  updateBookingStatus,
} from "../controllers/booking.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";

const bookingRouter = express.Router();
bookingRouter.post("/", authMiddleware, createBooking);
bookingRouter.get(
  "/trainer/:id",
  authMiddleware,
  roleMiddleware("trainer", "admin"),
  getBookingByTrainer
);
bookingRouter.get("/user/:id", authMiddleware, getBookingByuser);
bookingRouter.patch(
  "/status/:id",
  authMiddleware,
  roleMiddleware("admin", "trainer"),
  updateBookingStatus
);
bookingRouter.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "trainer"),
  deleteBooking
);

export default bookingRouter;

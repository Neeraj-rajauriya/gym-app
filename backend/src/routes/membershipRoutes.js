import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";
import {
  getAllMembershipPlans,
  createMembership,
  updateMembership,
  deleteMembership,
} from "../controllers/membershipController.js";
const membershipRouter = express.Router();

membershipRouter.get("/", authMiddleware, getAllMembershipPlans);
membershipRouter.post(
  "/create",
  authMiddleware,
  roleMiddleware("admin"),
  createMembership
);
membershipRouter.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateMembership
);
membershipRouter.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteMembership
);

export default membershipRouter;

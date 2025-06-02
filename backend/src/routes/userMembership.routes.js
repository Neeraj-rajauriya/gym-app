import express from "express";
import {
  createMembership,
  getUserMembership,
  getAllUserMembership,
  updateUserMembership,
  deleteMembership,
} from "../controllers/userMembershipController.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";

const userMembershipRouter = express.Router();

userMembershipRouter.post("/", authMiddleware, createMembership);
userMembershipRouter.get(
  "/all",
  authMiddleware,
  roleMiddleware("admin"),
  getAllUserMembership
);
userMembershipRouter.get("/:id", authMiddleware, getUserMembership);
userMembershipRouter.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateUserMembership
);
userMembershipRouter.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteMembership
);

export default userMembershipRouter;

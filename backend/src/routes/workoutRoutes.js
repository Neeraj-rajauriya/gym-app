import express from "express";
import {
  createWorkout,
  getAllWorkout,
  updateWorkout,
  deleteworkOut,
  assignedWorkoutToUser,
  getWorkoutById,
  searchWorkout
} from "../controllers/workoutController.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";
const workoutRouter = express.Router();

workoutRouter.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "trainer"),
  createWorkout
);
workoutRouter.get("/", authMiddleware, getAllWorkout);
workoutRouter.get(
  "/search",
  authMiddleware,
  roleMiddleware("admin", "trainer"),
  searchWorkout
);
workoutRouter.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "trainer"),
  updateWorkout
);
workoutRouter.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "trainer"),
  deleteworkOut
);
workoutRouter.patch(
  "/assign/:id",
  authMiddleware,
  roleMiddleware("admin", "trainer"),
  assignedWorkoutToUser
);
workoutRouter.get("/:id", authMiddleware, getWorkoutById);


export default workoutRouter;

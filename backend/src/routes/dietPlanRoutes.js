import express from "express";
import {
  createDietPlan,
  getAllDietPlan,
  getDietPlan,
  deleteDietPlan,
  assignDietToUser,
  updateDietplan
} from "../controllers/dietContoller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";

const dietPlanRouter = express.Router();
dietPlanRouter.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "trainer"),
  createDietPlan
);
dietPlanRouter.get("/", authMiddleware, getAllDietPlan);
dietPlanRouter.get("/:id", authMiddleware, getDietPlan);
dietPlanRouter.patch("/:id", authMiddleware,roleMiddleware('admin','trainer'), updateDietplan);
dietPlanRouter.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "trainer"),
  deleteDietPlan
);
dietPlanRouter.patch(
  "/assign/:id",
  authMiddleware,
  roleMiddleware("admin", "trainer"),
  assignDietToUser
);

export default dietPlanRouter;

'use client'
import express from "express";
import { upload } from "../middleware/multer.middleware.js";
import {
  uploadProgress,
  getUserProgress,
  addTrainerComment,
  updateProgress,
  deleteProgress
} from "../controllers/progress.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";

const progressRouter = express.Router();

progressRouter.post("/", authMiddleware, upload.single("photo"), uploadProgress);
progressRouter.get("/:id", authMiddleware, getUserProgress);
progressRouter.patch("/:progressId", authMiddleware, roleMiddleware("admin","trainer"), addTrainerComment);


progressRouter.put(
  "/:progressId",
  authMiddleware,
  upload.single("photo"),
  updateProgress
);

progressRouter.delete(
  "/:progressId",
  authMiddleware,
  deleteProgress
);
export default progressRouter;

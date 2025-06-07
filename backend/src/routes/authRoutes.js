import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getAllUser
} from "../controllers/authController.js";
import {authMiddleware} from "../middleware/auth.middleware.js" 
import {roleMiddleware} from "../middleware/role.middleware.js"
const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password/:token", resetPassword);
authRouter.get('/',authMiddleware,roleMiddleware('admin'),getAllUser);

export default authRouter;

import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getAllUser,
  getUserByEmail,
  checkAdminExists
} from "../controllers/authController.js";
import {authMiddleware} from "../middleware/auth.middleware.js" 
import {roleMiddleware} from "../middleware/role.middleware.js"
const authRouter = express.Router();

authRouter.get("/admin-exists", checkAdminExists); // Add this line
authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password/:token", resetPassword);
authRouter.get('/',authMiddleware,roleMiddleware('admin'),getAllUser);
authRouter.get('/search',authMiddleware,roleMiddleware('admin','trainer'),getUserByEmail);


export default authRouter;

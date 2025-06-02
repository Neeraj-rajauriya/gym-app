import express, { urlencoded } from "express";
import cors from 'cors'
import dotenv from "dotenv";
import path from "path"
import { connectDB } from "./src/config/db.js";
import authRouter from "./src/routes/authRoutes.js";
import membershipRouter from "./src/routes/membershipRoutes.js";
import userMembershipRouter from "./src/routes/userMembership.routes.js";
import paymentRouter from "./src/routes/payment.routes.js";
import workoutRouter from "./src/routes/workoutRoutes.js";
import dietPlanRouter from "./src/routes/dietPlanRoutes.js";
import bookingRouter from "./src/routes/bookingRoutes.js";
import progressRouter from "./src/routes/progressRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(cors())


connectDB();

app.use("/api/auth", authRouter);
app.use("/api/membership", membershipRouter);
app.use("/api/userMembership", userMembershipRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/workout", workoutRouter);
app.use("/api/dietPlan", dietPlanRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/progress", progressRouter);


app.listen(process.env.PORT, () => {
  console.log("Server is running on Port number", process.env.PORT);
});

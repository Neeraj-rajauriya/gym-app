import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    require: true,
  },
  userMembershipId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserMembership",
    require: true,
  },
  amount: {
    type: Number,
    require: true,
  },
  status: {
    type: "String",
    enum: ["Pending", "Success", "Failed"],
    default: "Failed",
  },
  paymentMethod: {
    type: String,
    enum: ["Razorpay", "UPI", "Card"],
    default: "Razorpay",
  },
  transactionId: {
    type: String,
    default: null,
  },
  paymentDate: {
    type: Date,
    default: Date.now(),
  },
});

export const payment = mongoose.model("Payment", paymentSchema);

import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  timeSlot: {
    type: String,
    required: true,
    enum: ["6AM-7AM", "7AM-8AM", "8AM-9AM", "5PM-6PM", "6PM-7PM", "7PM-8PM"],
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export const booking = mongoose.model("booking", bookingSchema);

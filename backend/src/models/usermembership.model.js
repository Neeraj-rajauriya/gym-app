import mongoose from "mongoose";

const userMembershipSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  membershipPlanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MembershipPlan",
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "Success", "Failed"],
    default: "pending",
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export const userMembership = mongoose.model(
  "UserMembership",
  userMembershipSchema
);

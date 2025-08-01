import mongoose from "mongoose";

const dietPlanSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    meals: [
      {
        name: String,
        time: String,
        calories: Number,
      },
    ],
    goal: {
      type: String,
      enum: ["weight loss", "muscle gain", "maintenance","athletic performance"],
      default: "maintain",
    },
    totalcalories: Number,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  { timestamps: true }
);

export const dietPlan = mongoose.model("dietPlan", dietPlanSchema);

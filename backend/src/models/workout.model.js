import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique:true
    },
    goal: {
      type: String,
      // enum: ["Weight Loss", "Muscle Gain", "Endurance", "Flexibility"],
    },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    exercises: [
      {
        name: String,
        sets: Number,
        reps: Number,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

export const workout = mongoose.model("workout", workoutSchema);

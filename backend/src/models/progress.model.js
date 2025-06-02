import mongoose from "mongoose";
import { user } from "./user.model.js";

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    weight: {
      type: Number,
      required: true,
    },
    bodyFat: {
      type: Number,
      required: true,
    },
    photo: {
      type: String, // URL from Cloudinary or local uploads
      required: true,
    },
    notes: {
      type: String,
    },
    trainerComment: {
      type: String,
    },
    commentedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required:true
    }
  },
  { timestamps: true }
);

export const progress=mongoose.model("Progress", progressSchema);

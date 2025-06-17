import {progress} from "../models/progress.model.js";
import {user} from "../models/user.model.js";

export const uploadProgress = async (req, res) => {
  try {
    const { weight, bodyFat, notes } = req.body;
    const userId = req.user._id;

    const photo = req.file?.path;

    if (!photo || !weight || !bodyFat) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    const newProgress = new progress({
      user: userId,
      weight,
      bodyFat,
      notes,
      photo,
    });

    await newProgress.save();

    res.status(201).json({
      success: true,
      message: "Progress uploaded",
      data: newProgress,
    });
  } catch (error) {
    console.error("Upload Progress Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getUserProgress = async (req, res) => {
  try {
    const userId = req.params.id;

    const getProgress = await progress.find({ user: userId }).sort({ date: -1 });

    if(!getProgress){
      return res.status(400).json({success:false,message:"Progress not found!"});
    }

    res.status(200).json({
      success: true,
      message: "Progress fetched",
      data: getProgress,
    });
  } catch (error) {
    console.error("Get Progress Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const addTrainerComment = async (req, res) => {
  try {
    const { progressId } = req.params;
    const trainerId=req.user._id;
    const { comment } = req.body;

    const updateProgress = await progress.findById(progressId);
    if (!updateProgress) {
      return res.status(404).json({ success: false, message: "Progress not found" });
    }

    updateProgress.trainerComment = comment;
    updateProgress.commentedBy=trainerId;
    await updateProgress.save();

    res.status(200).json({
      success: true,
      message: "Comment added",
      data: updateProgress,
    });
  } catch (error) {
    console.error("Trainer Comment Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteProgress = async (req, res) => {
  try {
    const { progressId } = req.params;
    const userId = req.user._id;

    const progressEntry = await progress.findOneAndDelete({ 
      _id: progressId, 
      user: userId 
    });

    if (!progressEntry) {
      return res.status(404).json({ success: false, message: "Progress entry not found" });
    }

    res.status(200).json({
      success: true,
      message: "Progress entry deleted",
    });
  } catch (error) {
    console.error("Delete Progress Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateProgress = async (req, res) => {
  try {
    const { progressId } = req.params;
    const userId = req.user._id;
    const { weight, bodyFat, notes } = req.body;
    const photo = req.file?.path;

    const updates = {};
    if (weight) updates.weight = weight;
    if (bodyFat) updates.bodyFat = bodyFat;
    if (notes) updates.notes = notes;
    if (photo) updates.photo = photo;

    const updatedProgress = await progress.findOneAndUpdate(
      { _id: progressId, user: userId },
      updates,
      { new: true }
    );

    if (!updatedProgress) {
      return res.status(404).json({ success: false, message: "Progress entry not found" });
    }

    res.status(200).json({
      success: true,
      message: "Progress updated",
      data: updatedProgress,
    });
  } catch (error) {
    console.error("Update Progress Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


import { user } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendMail from "../utils/sendMail.js";
import dotenv from "dotenv";
dotenv.config();

export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, age, gender, role } = req.body;
    if (role === 'admin') {
      const adminExists = await user.findOne({ role: 'admin' });
      if (adminExists) {
        return res.status(403).json({ 
          success: false, 
          msg: "Admin already exists. Only one admin account is allowed." 
        });
      }
    }
    const existingUser = await user.countDocuments({ email });
    if (existingUser > 0) {
      res.status(200).json({ success: false, msg: "User Already Exist" });
      return;
    }
    const newPassword = await bcrypt.hash(password, 10);
    const newUser = await user.create({
      name,
      email,
      phone,
      password: newPassword,
      age,
      gender,
      role:role || 'user',
    });
    return res.status(200).send({ success: true, newUser });
  } catch (err) {
    console.log("Error is", err.message);
    res.status(400).json({ success: false, msg: "Invalid Data" });
  }
};

export const loginUser = async (req, res) => {
  try {
    console.log("Function calling!");
    const { email, password } = req.body;
    const existingUser = await user.findOne({ email });
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, msg: "Invalid Crendentials" });
    }
    const token = jwt.sign(
      { userId: existingUser._id, role: existingUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).send({ success: true, msg: "Login Sucessfull", token });
  } catch (err) {
    console.log("Internal Server Error", err.message);
    return res
      .status(401)
      .json({ success: false, msg: "Invalid email or password" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const getUser = await user.findOne({ email });
    if (!getUser) {
      return res
        .status(404)
        .json({ Success: false, message: "User not exist" });
    }
    const token = jwt.sign({ userId: getUser._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
    // const resetLink = `http://localhost:4000/reset-password/${token}`;
    const resetLink = `http://localhost:3000/auth/reset-password?token=${token}`;

    await sendMail(
      email,
      "Password Reset - Gym App",
      `Reset your password using this link: ${resetLink}`, // plain text version
      `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; padding: 30px; border-radius: 10px; color: #333; max-width: 600px; margin: auto;">
    <div style="background-color: #ff6b6b; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
      <h2 style="margin: 0;">🔐 Password Reset Request</h2>
    </div>
    <div style="background-color: white; padding: 25px; border: 1px solid #e0e0e0; border-top: none;">
      <p style="font-size: 16px;">Hi there,</p>
      <p style="font-size: 15px;">
        We received a request to reset your password for your <strong>Gym App</strong> account.
        If this was you, click the button below to reset your password:
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" 
           style="background-color: #ff6b6b; color: white; text-decoration: none; padding: 12px 20px; border-radius: 6px; display: inline-block; font-weight: bold;">
          Reset Password
        </a>
      </div>

      <p style="font-size: 14px; color: #666;">This link is valid for <strong>15 minutes</strong>. If you did not request this, you can safely ignore this email.</p>

      <p style="margin-top: 30px; font-size: 15px;">Stay strong,<br/><strong style="color: #ff6b6b;">The GymApp Team 💪</strong></p>
    </div>
  </div>
  `
    );

    res
      .status(200)
      .json({ Success: true, message: "Reset link sent to your mail" });
  } catch (err) {
    console.log("Internal Server Error", err.message);
    return res
      .status(401)
      .json({ success: false, msg: "Invalid email or password" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const getUser = await user.findById(decoded.userId);
    if (!getUser) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }
    getUser.password = await bcrypt.hash(newPassword, 10);
    await getUser.save();
    res
      .status(200)
      .json({ Success: true, message: "Password reset sucessfull" });
  } catch (err) {
    console.log("Internal Server Error", err.message);
    return res
      .status(401)
      .json({ success: false, msg: "Invalid email or password" });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const allUsers = await user.find({});
    res.json({ success: true, message: "ALl users", allUsers });
  } catch (err) {
    console.log("Internal Server Error", err.message);
    return res
      .status(401)
      .json({ success: false, msg: "Invalid email or password" });
  }
};

export const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email query parameter is required" });
    }
    const exists = await user.findOne({ email });
    if (!exists) {
      return res
        .status(404)
        .json({ Success: false, message: "User not found" });
    }
    res.status(200).json({ Success: true, message: "User found", exists });
  } catch (err) {
    console.log("Internal Server Error", err.message);
    return res
      .status(401)
      .json({ success: false, msg: "Invalid email or password" });
  }
};


export const checkAdminExists = async (req, res) => {
  try {
    // Check database for any admin users
    const adminCount = await user.countDocuments({ role: 'admin' });
    
    return res.status(200).json({ 
      success: true,
      exists: adminCount > 0,
      count: adminCount
    });
    
  } catch (err) {
    console.error('Admin check error:', err.message);
    return res.status(500).json({ 
      success: false,
      error: "Server error while checking admin status",
      message: err.message
    });
  }
};

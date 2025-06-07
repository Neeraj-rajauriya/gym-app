import { payment } from "../models/payment.model.js";
import { userMembership } from "../models/usermembership.model.js";
import { user } from "../models/user.model.js";
import { MembershipPlan } from "../models/membership.model.js";

export const createPayment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { membershipPlanId, amount } = req.body;
    const plan=await MembershipPlan.findById(membershipPlanId);
    if (!plan) {
      return res.status(404).json({ success: false, message: "Membership Plan Not Found!" });
    }
    if (amount !== plan.price) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }
    const newPayment = await payment.create({
      userId,
      membershipPlanId,
      amount,
      status: "Pending",
      paymentMethod: "Razorpay", 
    });
    res.status(201).json({success:true,message:"Payment Initiated",newPayment});
    console.log("Payment initiated:", newPayment);
  } catch (err) {
    console.log("Error", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const existingPayment = await payment.findById(id);
    if (!existingPayment) {
      return res
        .status(404)
        .json({ Sucess: false, message: "Payment Not Found!" });
    }
    existingPayment.status = status;
    await existingPayment.save();
    if (existingPayment.status === "success") {
      const membership = await userMembership
        .findById(existingPayment.userMembershipId)
        .populate("membershipPlanId");
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(
        startDate.getMonth() + membership.membershipPlanId.duration
      );
      membership.paymentStatus = "success";
      membership.startDate = startDate;
      membership.endDate = endDate;

      await membership.save();
    }
    res.status(200).json({
      success: true,
      message: "Payment Updated Successfully",
      existingPayment,
    });
  } catch (err) {
    console.log("Error", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getAllpayment = async (req, res) => {
  try {
    const payments = await payment
      .find()
      .populate("userId", "name email")
      .populate({
        path: "userMembershipId",
        populate: { path: "membershipPlanId" },
      });
    console.log("Payment", payments);
    res
      .status(200)
      .json({ Sucess: true, message: "All Payments Fetched", payments });
  } catch (err) {
    console.log("Error", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getUserPayment = async (req, res) => {
  try {
    const userId = req.user._id;
    const getPayment = await payment.find({ userId }).populate({
      path: "userMembershipId",
      populate: { path: "membershipPlanId" },
    });
    if (!getPayment) {
      return res
        .status(404)
        .json({ success: false, message: "Payment not found!" });
    }
    res.status(200).json({ success: true, getPayment });
  } catch (err) {
    console.log("Error", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const getPayment = await payment
      .findById(id)
      .populate("userId", "name email")
      .populate({
        path: "userMembershipId",
        populate: { path: "membershipPlanId" },
      });
    if (!getPayment) {
      return res
        .status(404)
        .json({ success: false, message: "Paymemt not found" });
    }
    res.status(200).json({ success: true, getPayment });
  } catch (err) {
    console.log("Error", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

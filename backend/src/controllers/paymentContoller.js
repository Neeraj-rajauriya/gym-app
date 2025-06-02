import { payment } from "../models/payment.model.js";
import { userMembership } from "../models/usermembership.model.js";
import { user } from "../models/user.model.js";
import { MembershipPlan } from "../models/membership.model.js";

export const createPayment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { userMembershipId, amount } = req.body;
    const membership = await userMembership
      .findById(userMembershipId)
      .populate("membershipPlanId");
    if (!membership) {
      return res
        .status(404)
        .json({ Success: false, message: "Membership Not Found!" });
    }

    const planAmount = membership.membershipPlanId.price;
    if (amount !== planAmount) {
      return res.status(400).json({ Success: true, message: "Invalid amount" });
    }
    const newPayment = await payment.create({
      userId,
      userMembershipId,
      amount,
      status: "Pending",
    });
    console.log("newPayment is", newPayment);
    res
      .status(201)
      .json({ Success: true, message: "Payment Initiated", newPayment });
  } catch (err) {
    console.log("Error", err.message);
    res.status(500).json({ Success: false, message: "Internal Server Error" });
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
    if (existingPayment.status === "Success") {
      const membership = await userMembership
        .findById(existingPayment.userMembershipId)
        .populate("membershipPlanId");
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(
        startDate.getMonth() + membership.membershipPlanId.duration
      );
      membership.paymentStatus = "Success";
      membership.startDate = startDate;
      membership.endDate = endDate;

      await membership.save();
    }
    res.status(200).json({
      Success: true,
      message: "Payment Updated Successfully",
      existingPayment,
    });
  } catch (err) {
    console.log("Error", err.message);
    res.status(500).json({ Success: false, message: "Internal Server Error" });
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
    res.status(500).json({ Success: false, message: "Internal Server Error" });
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
        .json({ Success: false, message: "Payment not found!" });
    }
    res.status(200).json({ Success: true, getPayment });
  } catch (err) {
    console.log("Error", err.message);
    res.status(500).json({ Success: false, message: "Internal Server Error" });
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
        .json({ Success: false, message: "Paymemt not found" });
    }
    res.status(200).json({ Success: true, getPayment });
  } catch (err) {
    console.log("Error", err.message);
    res.status(500).json({ Success: false, message: "Internal Server Error" });
  }
};

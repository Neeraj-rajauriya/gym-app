import { userMembership } from "../models/usermembership.model.js";
import { MembershipPlan } from "../models/membership.model.js";
import { user } from "../models/user.model.js";
import sendMail from "../utils/sendMail.js";

export const createMembership = async (req, res) => {
  try {
    const { membershipPlanId } = req.body;
    const userId = req.user._id;
    const plan = await MembershipPlan.findById(membershipPlanId);
    if (!plan) {
      return res
        .status(404)
        .json({ Success: "false", messge: "Plan Not found!" });
    }
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(startDate.getMonth() + plan.duration);

    console.log("Start Date is:", startDate);
    console.log("End Date:", endDate);
    const membership = new userMembership({
      userId,
      membershipPlanId,
      paymentStatus: "Success",
      startDate,
      endDate,
    });
    await membership.save();
    // Fetch user email - assuming you have a User model
    const existingUser = await user.findById(userId);
    console.log("Existing user is:", existingUser);
    if (existingUser && existingUser.email) {
      const subject = "Welcome to Your New Membership Plan!";
      const text = `Hello,

Thank you for subscribing to the ${plan.name} plan.

Your membership starts on ${startDate.toDateString()} and ends on ${endDate.toDateString()}.

Enjoy your journey with us!

Best regards,
The Team`;

      const html = `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; padding: 30px; border-radius: 10px; color: #333; max-width: 600px; margin: auto;">
    <div style="background-color: #4CAF50; color: white; padding: 15px 20px; border-radius: 8px 8px 0 0;">
      <h2 style="margin: 0;">🎉 Welcome to Your New Membership Plan!</h2>
    </div>
    <div style="background-color: white; padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
      <p style="font-size: 16px;">Hi <strong>${
        existingUser.name || "Member"
      }</strong>,</p>
      
      <p style="font-size: 15px;">Thank you for subscribing to the <strong style="color: #4CAF50;">${
        plan.name
      }</strong> plan. We're thrilled to support you on your fitness journey 💪.</p>
      
      <div style="background-color: #f1f8e9; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h4 style="margin-top: 0;">📅 Membership Details:</h4>
        <ul style="padding-left: 20px;">
          <li><strong>Start Date:</strong> ${startDate.toDateString()}</li>
          <li><strong>End Date:</strong> ${endDate.toDateString()}</li>
        </ul>
      </div>

      <p style="font-size: 15px;">We’re here to support and motivate you. Get ready to smash your goals! 🚀</p>
      
      <p style="margin-top: 30px; font-size: 15px;">Warm wishes,<br/><strong style="color: #4CAF50;">The GymApp Team</strong></p>
    </div>
  </div>
`;

      await sendMail(existingUser.email, subject, text, html);
    }

    res.status(200).json({
      Success: true,
      message: "Membership Created Successfully",
      membership,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ Success: false, msg: "Internal server error" });
  }
};

export const getUserMembership = async (req, res) => {
  try {
    const userId = req.user._id;
    const membership = await userMembership
      .findOne({ userId })
      .populate("membershipPlanId", "name duration price benefits");
    if (!membership) {
      return res
        .status(404)
        .json({ Success: "false", messge: "Membership Not found!" });
    }
    res.status(200).json({ Success: true, membership });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ Success: false, message: "Internal Server Error" });
  }
};

export const getAllUserMembership = async (req, res) => {
  try {
    const membership = await userMembership.find({}).populate("userId","name").populate("membershipPlanId","name");
    res
      .status(200)
      .json({ Success: true, message: "All user membership", membership });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ Success: false, message: "Internal Server Error" });
  }
};

export const updateUserMembership = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const membership = await updateUserMembership.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!membership) {
      return res
        .status(404)
        .json({ Success: "false", messge: "Membership Not found!" });
    }
    res.status(200).json({
      Success: true,
      message: "Membership Updated Successfully",
      membership,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ Success: false, message: "Internal Server Error" });
  }
};

export const deleteMembership = async (req, res) => {
  try {
    const { id } = req.params;
    const membership = await userMembership.findByIdAndDelete(id);
    if (!membership) {
      return res
        .status(404)
        .json({ Success: "false", messge: "Membership Not found!" });
    }
    res
      .status(200)
      .json({ Success: true, message: "Membership Deleted Successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ Success: false, message: "Internal Server Error" });
  }
};

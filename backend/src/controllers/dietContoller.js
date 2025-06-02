import { dietPlan } from "../models/diet.model.js";
import { user } from "../models/user.model.js";
import sendMail from "../utils/sendMail.js";

export const createDietPlan = async (req, res) => {
  try {
    const { title, meals, goal, totalcalories } = req.body;
    const newPlan = await dietPlan.create({
      title,
      meals,
      goal,
      totalcalories,
      createdBy: req.user._id,
    });
    res
      .status(201)
      .json({
        Success: true,
        message: "Diet Plan Created Successfully",
        newPlan,
      });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ Success: false, message: "Internal Server Error" });
  }
};

export const getAllDietPlan = async (req, res) => {
  try {
    const dielPlans = await dietPlan.find().populate("createdBy", "name email");
    res.status(200).json({ Success: true, dielPlans });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ Success: false, message: "Internal Server Error" });
  }
};

export const updateDietplan = async (req, res) => {
  try {
    const updatedDietPlan = await dietPlan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updateDietplan) {
      return res
        .status(404)
        .json({ Success: false, message: " Diet Plan not found!" });
    }
    res.status(200).json({ Success: true, updatedDietPlan });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ Success: false, message: "Internal Server Error" });
  }
};

export const getDietPlan = async (req, res) => {
  try {
    const plan = await dietPlan.findById(req.params.id);
    if (!plan) {
      return res
        .status(404)
        .json({ Success: false, message: " Diet Plan not found!" });
    }
    res.status(200).json({ Success: true, plan });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ Success: false, message: "Internal Server Error" });
  }
};

export const deleteDietPlan = async (req, res) => {
  try {
    const diet = await dietPlan.findByIdAndDelete(req.params.id);
    if (!diet) {
      return res
        .status(404)
        .json({ Success: false, message: " Diet Plan not found!" });
    }
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const assignDietToUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { dietPlanId } = req.body;
    const updateUser = await user.findByIdAndUpdate(
      id,
      { assignedDiet: dietPlanId },
      { new: true }
    );
    if (!updateUser) {
      return res
        .status(404)
        .json({ Success: false, message: " User not found!" });
    }
    // Fetch diet plan details to include in the email
    const plan = await dietPlan.findById(dietPlanId);
    if (!plan) {
      return res
        .status(404)
        .json({ Success: false, message: "Diet plan not found!" });
    }

    // Compose HTML email
    const html = `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; padding: 30px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); overflow: hidden;">
      <div style="background: linear-gradient(90deg, #4CAF50, #81C784); padding: 20px; text-align: center; color: white;">
        <h2 style="margin: 0;">🥗 Your New Diet Plan Is Here!</h2>
        <p style="margin: 5px 0 0;">Stay healthy. Stay fit.</p>
      </div>
      <div style="padding: 25px;">
        <p style="font-size: 16px;">Hi <strong>${updateUser.name}</strong>,</p>
        <p style="font-size: 15px;">We're excited to let you know that a new diet plan has been assigned to you. Below are your plan details:</p>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background-color: #f0f0f0;">
            <td style="padding: 10px;"><strong>Plan Title:</strong></td>
            <td style="padding: 10px;">${plan.title}</td>
          </tr>
          <tr>
            <td style="padding: 10px;"><strong>Goal:</strong></td>
            <td style="padding: 10px;">${plan.goal}</td>
          </tr>
          <tr style="background-color: #f0f0f0;">
            <td style="padding: 10px;"><strong>Total Calories:</strong></td>
            <td style="padding: 10px;">${plan.totalcalories} kcal</td>
          </tr>
        </table>

        <h3 style="margin-top: 30px; color: #4CAF50;">🍽 Meals Included:</h3>
        <ul style="padding-left: 20px; font-size: 15px;">
          ${plan.meals
            .map(
              (meal) =>
                `<li style="margin-bottom: 8px;"><strong>${meal.time}:</strong> ${meal.name} (${meal.calories} cal)</li>`
            )
            .join("")}
        </ul>

        <p style="margin-top: 30px;">Make sure to follow your diet consistently to achieve your goals!</p>
        <p style="font-style: italic;">We're with you every step of the way.</p>

        <div style="margin-top: 40px; text-align: center;">
          <a href="https://your-gym-app.com" style="background-color: #4CAF50; color: white; padding: 12px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">View in App</a>
        </div>
      </div>
      <div style="background: #eeeeee; padding: 15px; text-align: center; font-size: 13px; color: #777;">
        © ${new Date().getFullYear()} Gym App. All rights reserved.
      </div>
    </div>
  </div>
`;

    // Send email
    await sendMail(
      updateUser.email,
      "Your Diet Plan Has Been Assigned!",
      `Your new diet plan "${plan.title}" has been assigned.`,
      html
    );
    res
      .status(200)
      .json({
        Success: true,
        message: "Diet plan Assigned and email sent",
        updateDietplan,
      });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

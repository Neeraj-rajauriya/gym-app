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

// export const assignDietToUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { dietPlanId } = req.body;
//     const updateUser = await user.findByIdAndUpdate(
//       id,
//       { assignedDiet: dietPlanId },
//       { new: true }
//     );
//     if (!updateUser) {
//       return res
//         .status(404)
//         .json({ Success: false, message: " User not found!" });
//     }
//     // Fetch diet plan details to include in the email
//     const plan = await dietPlan.findById(dietPlanId);
//     if (!plan) {
//       return res
//         .status(404)
//         .json({ Success: false, message: "Diet plan not found!" });
//     }

//     // Compose HTML email
//     const html = `
//   <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; padding: 30px;">
//     <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); overflow: hidden;">
//       <div style="background: linear-gradient(90deg, #4CAF50, #81C784); padding: 20px; text-align: center; color: white;">
//         <h2 style="margin: 0;">🥗 Your New Diet Plan Is Here!</h2>
//         <p style="margin: 5px 0 0;">Stay healthy. Stay fit.</p>
//       </div>
//       <div style="padding: 25px;">
//         <p style="font-size: 16px;">Hi <strong>${updateUser.name}</strong>,</p>
//         <p style="font-size: 15px;">We're excited to let you know that a new diet plan has been assigned to you. Below are your plan details:</p>

//         <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
//           <tr style="background-color: #f0f0f0;">
//             <td style="padding: 10px;"><strong>Plan Title:</strong></td>
//             <td style="padding: 10px;">${plan.title}</td>
//           </tr>
//           <tr>
//             <td style="padding: 10px;"><strong>Goal:</strong></td>
//             <td style="padding: 10px;">${plan.goal}</td>
//           </tr>
//           <tr style="background-color: #f0f0f0;">
//             <td style="padding: 10px;"><strong>Total Calories:</strong></td>
//             <td style="padding: 10px;">${plan.totalcalories} kcal</td>
//           </tr>
//         </table>

//         <h3 style="margin-top: 30px; color: #4CAF50;">🍽 Meals Included:</h3>
//         <ul style="padding-left: 20px; font-size: 15px;">
//           ${plan.meals
//             .map(
//               (meal) =>
//                 `<li style="margin-bottom: 8px;"><strong>${meal.time}:</strong> ${meal.name} (${meal.calories} cal)</li>`
//             )
//             .join("")}
//         </ul>

//         <p style="margin-top: 30px;">Make sure to follow your diet consistently to achieve your goals!</p>
//         <p style="font-style: italic;">We're with you every step of the way.</p>

//         <div style="margin-top: 40px; text-align: center;">
//           <a href="https://your-gym-app.com" style="background-color: #4CAF50; color: white; padding: 12px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">View in App</a>
//         </div>
//       </div>
//       <div style="background: #eeeeee; padding: 15px; text-align: center; font-size: 13px; color: #777;">
//         © ${new Date().getFullYear()} Gym App. All rights reserved.
//       </div>
//     </div>
//   </div>
// `;

//     // Send email
//     await sendMail(
//       updateUser.email,
//       "Your Diet Plan Has Been Assigned!",
//       `Your new diet plan "${plan.title}" has been assigned.`,
//       html
//     );
//     res
//       .status(200)
//       .json({
//         Success: true,
//         message: "Diet plan Assigned and email sent",
//         updateDietplan,
//       });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };


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
        .json({ Success: false, message: "User not found!" });
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
      <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 40px 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
          <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px 20px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 600;">Your Personalized Nutrition Plan</h1>
            <p style="margin-top: 8px; opacity: 0.9; font-size: 15px;">Fuel your body for success</p>
          </div>
          
          <div style="padding: 32px;">
            <div style="margin-bottom: 24px;">
              <p style="margin: 0 0 16px 0; color: #64748b;">Hi <strong style="color: #1e293b;">${updateUser.name}</strong>,</p>
              <p style="margin: 0; color: #64748b; line-height: 1.6;">Your nutritionist has prepared a customized diet plan tailored to your goals. Here are the key details:</p>
            </div>

            <div style="background-color: #f0fdf4; border-radius: 8px; padding: 20px; margin-bottom: 24px; border: 1px solid #d1fae5;">
              <h3 style="margin-top: 0; margin-bottom: 16px; color: #065f46; font-size: 18px;">Plan Summary</h3>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div>
                  <p style="margin: 0; font-size: 13px; color: #64748b; font-weight: 500;">PLAN NAME</p>
                  <p style="margin: 4px 0 0 0; font-size: 15px; color: #1e293b; font-weight: 600;">${plan.title}</p>
                </div>
                <div>
                  <p style="margin: 0; font-size: 13px; color: #64748b; font-weight: 500;">PRIMARY GOAL</p>
                  <p style="margin: 4px 0 0 0; font-size: 15px; color: #1e293b; font-weight: 600;">${plan.goal}</p>
                </div>
                <div>
                  <p style="margin: 0; font-size: 13px; color: #64748b; font-weight: 500;">DAILY CALORIES</p>
                  <p style="margin: 4px 0 0 0; font-size: 15px; color: #1e293b; font-weight: 600;">${plan.totalcalories} kcal</p>
                </div>
                <div>
                  <p style="margin: 0; font-size: 13px; color: #64748b; font-weight: 500;">TOTAL MEALS</p>
                  <p style="margin: 4px 0 0 0; font-size: 15px; color: #1e293b; font-weight: 600;">${plan.meals.length}</p>
                </div>
              </div>
            </div>

            <h3 style="margin: 0 0 16px 0; color: #065f46; font-size: 18px;">Daily Meal Plan</h3>
            
            <div style="margin-bottom: 24px;">
              ${plan.meals.map((meal, index) => `
                <div style="padding: 16px; background-color: ${index % 2 === 0 ? '#f8fafc' : '#ffffff'}; border-radius: 8px; margin-bottom: 8px; border: 1px solid #e2e8f0;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <div>
                      <h4 style="margin: 0; color: #1e293b; font-size: 16px; font-weight: 600;">${meal.time}</h4>
                      <p style="margin: 4px 0 0 0; color: #64748b; font-size: 14px;">${meal.name}</p>
                    </div>
                    <span style="background-color: #d1fae5; color: #065f46; padding: 4px 8px; border-radius: 20px; font-size: 12px; font-weight: 500;">${meal.calories} cal</span>
                  </div>
                  ${meal.description ? `<p style="margin: 8px 0 0 0; color: #64748b; font-size: 14px; line-height: 1.5;">${meal.description}</p>` : ''}
                </div>
              `).join('')}
            </div>

            <div style="background-color: #ecfdf5; border-radius: 8px; padding: 16px; margin-bottom: 24px; border: 1px solid #a7f3d0;">
              <h4 style="margin: 0 0 8px 0; color: #065f46; font-size: 15px;">📌 Important Notes</h4>
              <p style="margin: 0; color: #64748b; font-size: 14px; line-height: 1.6;">For optimal results, follow this plan consistently and stay hydrated throughout the day. Track your progress in the app.</p>
            </div>

            <div style="text-align: center; margin-top: 32px;">
              <a href="https://gymapp-frontend-1k6e.onrender.com/" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); transition: all 0.2s ease;">
                Access Full Plan in Dashboard
              </a>
            </div>
          </div>
          
          <div style="background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0;">© ${new Date().getFullYear()} GymApp Pro. All rights reserved.</p>
            <p style="margin: 8px 0 0 0;">Need help? Contact our support team at alphabulk14@gmail.com</p>
          </div>
        </div>
      </div>
    `;

    // Send email
    await sendMail(
      updateUser.email,
      "🌱 Your Custom Diet Plan Has Been Assigned",
      `Hello ${updateUser.name},\n\nYour nutritionist has assigned you the "${plan.title}" diet plan with ${plan.totalcalories} daily calories. Log in to your dashboard to view details: https://gymapp-frontend-1k6e.onrender.com/`,
      html
    );
    
    res.status(200).json({
      Success: true,
      message: "Diet plan assigned and notification sent successfully",
      updateUser,
    });
  } catch (err) {
    console
    res.status(500).json({ success: false, message: err.message });
  }
};
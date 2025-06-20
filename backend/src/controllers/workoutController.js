import { workout } from "../models/workout.model.js";
import { user } from "../models/user.model.js";
import sendMail from "../utils/sendMail.js";

export const createWorkout = async (req, res) => {
  try {
    const userId = req.user._id;
    const { title, goal, difficulty, exercises } = req.body;
    console.log("req body", req.body);
    const newWorkout = await workout.create({
       title,
       goal,
       difficulty,
       exercises,
       createdBy:userId,
    });
    res
      .status(200)
      .json({ Success: true, message: "New Workout Created", newWorkout });
  } catch (err) {
    console.log("Error is", err.message);
    res.status(500).json({ Success: false, message: "Internal Server Error" });
  }
};

export const getAllWorkout = async (req, res) => {
  try {
    const workouts = await workout.find();
    res
      .status(200)
      .json({ Success: true, message: "All workout fetched", workouts });
  } catch (err) {
    console.log("Error", err.message);
    res.status(500).json({ Success: false, message: "Internal Server Error" });
  }
};

export const getWorkoutById = async (req, res) => {
  try {
    const { id } = req.params;
    const getWorkout = await workout.findById(id);
    if (!workout) {
      return res
        .status(404)
        .json({ Success: false, message: "workout not found" });
    }
    res
      .status(200)
      .json({ Success: true, message: "Workout fetched", getWorkout });
  } catch (err) {
    console.log("Error", err.message);
    res.status(500).json({ Success: false, message: "Internal Server Error" });
  }
};

export const updateWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedWorkout = await workout.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updateWorkout) {
      return res
        .status(404)
        .json({ Success: false, message: "workout not found" });
    }
    res
      .status(200)
      .json({ Success: true, message: "Workout updated", updatedWorkout });
  } catch (err) {
    console.log("error", err.message);
    res.status(500).json({ Success: false, message: "Internal Server Error" });
  }
};

export const deleteworkOut = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedWorkout = await workout.findByIdAndDelete(id);
    if (!deletedWorkout) {
      return res
        .status(404)
        .json({ Success: false, message: "workout not found" });
    }
    res.status(200).json({ Success: true, message: "Workout deleted" });
  } catch (err) {
    console.log("error", err.message);
    res.status(500).json({ Success: false, message: "Internal Server Error" });
  }
};

// export const assignedWorkoutToUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { workoutId } = req.body;
//     const updateUser = await user
//       .findByIdAndUpdate(id, { assignedWorkout: workoutId }, { new: true })
//       .populate("assignedWorkout");
//     console.log("Update user is:", updateUser);
//     if (!updateUser) {
//       return res
//         .status(404)
//         .json({ Success: false, message: "User not found!" });
//     }

//     const plan = updateUser.assignedWorkout;

//     const html = `
//       <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; padding: 30px;">
//         <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
//           <div style="background: linear-gradient(to right, #2193b0, #6dd5ed); padding: 20px; text-align: center; color: #fff;">
//             <h2 style="margin: 0;">💪 Your Workout Plan is Ready!</h2>
//             <p style="margin-top: 5px;">Time to break a sweat 🔥</p>
//           </div>
//           <div style="padding: 25px;">
//             <p>Hi <strong>${updateUser.name}</strong>,</p>
//             <p>We're excited to inform you that a new workout plan has been assigned to you. Below are the details:</p>

//             <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
//               <tr style="background-color: #f0f0f0;">
//                 <td style="padding: 10px;"><strong>Workout Title:</strong></td>
//                 <td style="padding: 10px;">${plan.title}</td>
//               </tr>
//               <tr>
//                 <td style="padding: 10px;"><strong>Goal:</strong></td>
//                 <td style="padding: 10px;">${plan.goal}</td>
//               </tr>
//               <tr style="background-color: #f0f0f0;">
//                 <td style="padding: 10px;"><strong>Difficulty:</strong></td>
//                 <td style="padding: 10px;">${plan.difficulty}</td>
//               </tr>
//             </table>

//             <h3 style="margin-top: 25px; color: #2193b0;">🏋️ Exercises Included:</h3>
//             <ul style="font-size: 15px; padding-left: 20px;">
//               ${plan.exercises
//                 .map(
//                   (ex) =>
//                     `<li style="margin-bottom: 8px;"><strong>${ex.name}</strong> - ${ex.sets} sets x ${ex.reps} reps</li>`
//                 )
//                 .join("")}
//             </ul>

//             <p style="margin-top: 30px;">Stay consistent and focused. Your fitness journey has officially begun!</p>
//             <div style="text-align: center; margin-top: 35px;">
//               <a href="https://your-gym-app.com" target="_blank" style="text-decoration: none; background: #2193b0; color: white; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">View Your Plan</a>
//             </div>
//           </div>
//           <div style="background-color: #eeeeee; padding: 15px; text-align: center; font-size: 13px; color: #777;">
//             © ${new Date().getFullYear()} Gym App. All rights reserved.
//           </div>
//         </div>
//       </div>
//     `;

//     await sendMail(
//       updateUser.email,
//       "💪 New Workout Plan Assigned!",
//       `You've been assigned the workout plan: ${plan.title}`,
//       html
//     );

//     res.status(200).json({
//       Success: true,
//       message: "Workout Assigned! and email sent to user",
//       updateUser,
//     });
//   } catch (err) {
//     console.log("error", err.message);
//     res.status(500).json({ Success: false, message: "Internal Server Error" });
//   }
// };

export const assignedWorkoutToUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { workoutId } = req.body;
    const updateUser = await user
      .findByIdAndUpdate(id, { assignedWorkout: workoutId }, { new: true })
      .populate("assignedWorkout");
    console.log("Update user is:", updateUser);
    if (!updateUser) {
      return res
        .status(404)
        .json({ Success: false, message: "User not found!" });
    }

    const plan = updateUser.assignedWorkout;

    const html = `
      <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 40px 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
          <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 30px 20px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 600;">Your Personalized Workout Plan</h1>
            <p style="margin-top: 8px; opacity: 0.9; font-size: 15px;">Time to elevate your fitness journey</p>
          </div>
          
          <div style="padding: 32px;">
            <div style="margin-bottom: 24px;">
              <p style="margin: 0 0 16px 0; color: #64748b;">Hi <strong style="color: #1e293b;">${updateUser.name}</strong>,</p>
              <p style="margin: 0; color: #64748b; line-height: 1.6;">Your trainer has assigned you a new workout plan designed to help you reach your goals. Here's what you need to know:</p>
            </div>

            <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 24px; border: 1px solid #e2e8f0;">
              <h3 style="margin-top: 0; margin-bottom: 16px; color: #1e293b; font-size: 18px;">Plan Overview</h3>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
                <div>
                  <p style="margin: 0; font-size: 13px; color: #64748b; font-weight: 500;">TITLE</p>
                  <p style="margin: 4px 0 0 0; font-size: 15px; color: #1e293b; font-weight: 600;">${plan.title}</p>
                </div>
                <div>
                  <p style="margin: 0; font-size: 13px; color: #64748b; font-weight: 500;">GOAL</p>
                  <p style="margin: 4px 0 0 0; font-size: 15px; color: #1e293b; font-weight: 600;">${plan.goal}</p>
                </div>
                <div>
                  <p style="margin: 0; font-size: 13px; color: #64748b; font-weight: 500;">DIFFICULTY</p>
                  <p style="margin: 4px 0 0 0; font-size: 15px; color: #1e293b; font-weight: 600;">${plan.difficulty}</p>
                </div>
                <div>
                  <p style="margin: 0; font-size: 13px; color: #64748b; font-weight: 500;">EXERCISES</p>
                  <p style="margin: 4px 0 0 0; font-size: 15px; color: #1e293b; font-weight: 600;">${plan.exercises.length}</p>
                </div>
              </div>
            </div>

            <h3 style="margin: 0 0 16px 0; color: #1e293b; font-size: 18px;">Exercise Breakdown</h3>
            
            <div style="margin-bottom: 24px;">
              ${plan.exercises.map((ex, index) => `
                <div style="padding: 16px; background-color: ${index % 2 === 0 ? '#f8fafc' : '#ffffff'}; border-radius: 8px; margin-bottom: 8px; border: 1px solid #e2e8f0;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <h4 style="margin: 0; color: #1e293b; font-size: 16px; font-weight: 600;">${ex.name}</h4>
                    <span style="background-color: #e0f2fe; color: #0369a1; padding: 4px 8px; border-radius: 20px; font-size: 12px; font-weight: 500;">${ex.sets} sets × ${ex.reps} reps</span>
                  </div>
                  ${ex.notes ? `<p style="margin: 8px 0 0 0; color: #64748b; font-size: 14px; line-height: 1.5;">${ex.notes}</p>` : ''}
                </div>
              `).join('')}
            </div>

            <div style="text-align: center; margin-top: 32px;">
              <a href="https://gymapp-frontend-1k6e.onrender.com/" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); transition: all 0.2s ease;">
                View Your Plan in Dashboard
              </a>
            </div>
          </div>
          
          <div style="background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0;">© ${new Date().getFullYear()} GymApp. All rights reserved.</p>
            <p style="margin: 8px 0 0 0;">If you didn't request this, you can safely ignore this email.</p>
          </div>
        </div>
      </div>
    `;

    await sendMail(
      updateUser.email,
      "🚀 Your New Workout Plan Has Been Assigned",
      `Hello ${updateUser.name},\n\nYour trainer has assigned you the "${plan.title}" workout plan. Log in to your dashboard to view details: https://gymapp-frontend-1k6e.onrender.com/`,
      html
    );

    res.status(200).json({
      Success: true,
      message: "Workout assigned successfully and notification sent to user",
      updateUser,
    });
  } catch (err) {
    console.log("error", err.message);
    res.status(500).json({ Success: false, message: "Internal Server Error" });
  }
};

export const searchWorkout=async(req,res)=>{
try{
  const { name } = req.query;
  if (!name) {
      return res.status(400).json({ success: false, message: "Name query parameter is required" });
  }
  const foundWorkout = await workout.findOne({ title: new RegExp(name, "i") });
  console.log("workout is",foundWorkout);
  if (foundWorkout) {
    res.status(200).json({ Success:true,foundWorkout });
  } else {
    res.status(404).json({ Success:false,message:"workout not found"});
  }
}catch(err){
  console.log("error", err.message);
  res.status(500).json({ Success: false, message: "Internal Server Error" });
}
}
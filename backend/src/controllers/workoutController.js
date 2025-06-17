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
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <div style="background: linear-gradient(to right, #2193b0, #6dd5ed); padding: 20px; text-align: center; color: #fff;">
            <h2 style="margin: 0;">💪 Your Workout Plan is Ready!</h2>
            <p style="margin-top: 5px;">Time to break a sweat 🔥</p>
          </div>
          <div style="padding: 25px;">
            <p>Hi <strong>${updateUser.name}</strong>,</p>
            <p>We're excited to inform you that a new workout plan has been assigned to you. Below are the details:</p>

            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr style="background-color: #f0f0f0;">
                <td style="padding: 10px;"><strong>Workout Title:</strong></td>
                <td style="padding: 10px;">${plan.title}</td>
              </tr>
              <tr>
                <td style="padding: 10px;"><strong>Goal:</strong></td>
                <td style="padding: 10px;">${plan.goal}</td>
              </tr>
              <tr style="background-color: #f0f0f0;">
                <td style="padding: 10px;"><strong>Difficulty:</strong></td>
                <td style="padding: 10px;">${plan.difficulty}</td>
              </tr>
            </table>

            <h3 style="margin-top: 25px; color: #2193b0;">🏋️ Exercises Included:</h3>
            <ul style="font-size: 15px; padding-left: 20px;">
              ${plan.exercises
                .map(
                  (ex) =>
                    `<li style="margin-bottom: 8px;"><strong>${ex.name}</strong> - ${ex.sets} sets x ${ex.reps} reps</li>`
                )
                .join("")}
            </ul>

            <p style="margin-top: 30px;">Stay consistent and focused. Your fitness journey has officially begun!</p>
            <div style="text-align: center; margin-top: 35px;">
              <a href="https://your-gym-app.com" target="_blank" style="text-decoration: none; background: #2193b0; color: white; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">View Your Plan</a>
            </div>
          </div>
          <div style="background-color: #eeeeee; padding: 15px; text-align: center; font-size: 13px; color: #777;">
            © ${new Date().getFullYear()} Gym App. All rights reserved.
          </div>
        </div>
      </div>
    `;

    await sendMail(
      updateUser.email,
      "💪 New Workout Plan Assigned!",
      `You've been assigned the workout plan: ${plan.title}`,
      html
    );

    res.status(200).json({
      Success: true,
      message: "Workout Assigned! and email sent to user",
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
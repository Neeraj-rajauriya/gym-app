import { booking } from "../models/booking.model.js";
import { user } from "../models/user.model.js";
import sendMail from "../utils/sendMail.js";

export const createBooking = async (req, res) => {
  try {
    const { trainerId, date, timeSlot } = req.body;
    const userId = req.user._id;
    const trainer = await user.findById(trainerId);
    const userData = await user.findById(userId);
    if (!trainer || trainer.role !== "trainer") {
      return res
        .status(400)
        .json({ Success: false, message: "Invalid Trainer" });
    }
    const existingBooking = await booking.findOne({
      trainer: trainerId,
      date,
      timeSlot,
    });
    if (existingBooking) {
      return res
        .status(400)
        .json({ Success: false, message: "This slot is already booked" });
    }
    const newBooking = await booking.create({
      user: userId,
      trainer: trainerId,
      date,
      timeSlot,
    });

    const emailSubject = `📅 New Booking Request from ${userData.name}`;
    const emailText = `You have a new booking request from ${userData.name} (${userData.email}) on ${date} at ${timeSlot}.`;

    const emailHTML = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(to right, #f9f9f9, #e6f0ff); padding: 40px 20px;">
      <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 16px; box-shadow: 0 8px 20px rgba(0,0,0,0.1); padding: 30px;">
        <h2 style="text-align: center; color: #2C3E50; font-size: 28px; margin-bottom: 20px;">💪 New Booking Request!</h2>
        <p style="font-size: 16px; color: #333;">
          Hello <strong>${trainer.name}</strong>,
        </p>
        <p style="font-size: 16px; color: #333;">
          You have received a new booking request from <strong>${userData.name}</strong> (<a href="mailto:${userData.email}" style="color: #3498DB;">${userData.email}</a>).
        </p>
        <div style="background: #f1f9ff; padding: 15px 20px; border-radius: 12px; margin: 20px 0; border-left: 5px solid #3498DB;">
          <p style="margin: 0;"><strong>📅 Date:</strong> ${date}</p>
          <p style="margin: 0;"><strong>⏰ Time Slot:</strong> ${timeSlot}</p>
        </div>
        <p style="font-size: 16px; color: #333;">Please log in to your dashboard to accept or reject the booking.</p>
        <div style="text-align: center; margin-top: 30px;">
          <a href="http://localhost:3000/booking" style="background: #3498DB; color: #fff; padding: 12px 30px; border-radius: 30px; text-decoration: none; font-weight: bold; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: background 0.3s ease;">
            🔗 Go to Dashboard
          </a>
        </div>
        <p style="font-size: 13px; color: #888; margin-top: 40px; text-align: center;">This is an automated message from <strong>FitApp</strong>. Please do not reply.</p>
      </div>
    </div>
    `;

    await sendMail(trainer.email, emailSubject, emailText, emailHTML);
    res.status(201).json({
      Success: true,
      message: "Booking created Sucessfully",
      newBooking,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ Success: false, message: "Internal Server Error" });
  }
};

export const getBookingByuser = async (req, res) => {
  try {
    const { id } = req.params;
    const bookings = await booking
      .find({ user: id })
      .populate("trainer", "name email");
    if (!bookings) {
      return res
        .status(404)
        .json({ Success: false, message: "No booking found" });
    }
    res.status(200).json({ Success: true, bookings });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ Success: false, message: "Internal Server Error" });
  }
};

export const getBookingByTrainer = async (req, res) => {
  try {
    const { id } = req.params;
    const bookings = await booking
      .find({ trainer: id })
      .populate("user", "name email");
    if (!bookings) {
      return res
        .status(404)
        .json({ Success: false, message: "No booking found" });
    }
    res.status(200).json({ Success: true, bookings });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ Success: false, message: "Internal Server Error" });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!["pending", "confirmed", "cancelled", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }
    const updated = await booking
      .findByIdAndUpdate(id, { status }, { new: true })
      .populate("user", "name email")
      .populate("trainer", "name email");
    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    const subject = `📢 Your Booking Status Has Been Updated to "${status.toUpperCase()}"`;

    const plainText = `Hello ${updated.user.name}, your booking with ${updated.trainer.name} on ${updated.date} at ${updated.timeSlot} is now marked as ${status}.`;

    const html = `
    <div style="font-family: 'Helvetica Neue', sans-serif; background: #f5f8fa; padding: 30px;">
      <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 12px; padding: 25px 30px; box-shadow: 0 6px 16px rgba(0,0,0,0.1);">
        <h2 style="text-align: center; color: #2c3e50;">📢 Booking Status Updated</h2>
        <p style="font-size: 16px; color: #333;">Hi <strong>${
          updated.user.name
        }</strong>,</p>
        <p style="font-size: 16px; color: #333;">
          This is to inform you that your session booking with <strong>${
            updated.trainer.name
          }</strong> has been updated.
        </p>

        <div style="background: #ecf5ff; padding: 15px 20px; border-left: 5px solid #007BFF; border-radius: 10px; margin: 20px 0;">
          <p style="margin: 0;"><strong>📅 Date:</strong> ${updated.date}</p>
          <p style="margin: 0;"><strong>⏰ Time Slot:</strong> ${
            updated.timeSlot
          }</p>
          <p style="margin: 0;"><strong>🚦 Status:</strong> 
            <span style="color: ${
              status === "confirmed"
                ? "#27ae60"
                : status === "cancelled"
                ? "#e74c3c"
                : status === "rejected"
                ? "#c0392b"
                : "#f39c12"
            }; font-weight: bold; text-transform: capitalize;">${status}</span>
          </p>
        </div>

        <p style="font-size: 16px;">You can log in to your dashboard to view more details or reschedule if needed.</p>

        <div style="text-align: center; margin-top: 30px;">
          <a href="https://your-app-dashboard.com/dashboard" style="background-color: #007BFF; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold;">🔗 View Dashboard</a>
        </div>

        <p style="font-size: 13px; color: #999; text-align: center; margin-top: 40px;">Thanks for choosing <strong>FitApp</strong> 💪</p>
      </div>
    </div>
    `;

    await sendMail(updated.user.email, subject, plainText, html);
    res
      .status(200)
      .json({ success: true, message: "Status updated", booking: updated });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ Success: false, message: "Internal Server Error" });
  }
};


export const deleteBooking=async(req,res)=>{
    try{
        const deletebooking=await booking.findByIdAndDelete(req.params);
        if(!deletebooking){
            return res
        .status(404)
        .json({ Success: false, message: "No booking found" });
        }
        res.status(200).json({Success:true,message:"Successfully deleted Booking"})
    } catch (err) {
    console.log(err.message);
    res.status(500).json({ Success: false, message: "Internal Server Error" });
  }
}


export const getTrainers = async (req, res) => {
  try {
    const trainers = await user.find({ role: "trainer" }).select('name email');
    res.status(200).json({ Success: true, trainers });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ Success: false, message: "Internal Server Error" });
  }
};


// Add to your booking.controller.js
export const checkSlotAvailability = async (req, res) => {
  try {

    console.log("checkSlotAvailability calling",checkSlotAvailability)
    const { trainerId, date } = req.query;
    
    const bookedSlots = await booking.find({
      trainer: trainerId,
      date: date,
      status: { $in: ['pending', 'confirmed'] }
    }).select('timeSlot -_id');
    
    const bookedSlotValues = bookedSlots.map(slot => slot.timeSlot);
    
    res.status(200).json({ 
      success: true, 
      bookedSlots: bookedSlotValues 
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
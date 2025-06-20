import { booking } from "../models/booking.model.js";
import { user } from "../models/user.model.js";
import sendMail from "../utils/sendMail.js";

// export const createBooking = async (req, res) => {
//   try {
//     const { trainerId, date, timeSlot } = req.body;
//     const userId = req.user._id;
//     const trainer = await user.findById(trainerId);
//     const userData = await user.findById(userId);
//     if (!trainer || trainer.role !== "trainer") {
//       return res
//         .status(400)
//         .json({ Success: false, message: "Invalid Trainer" });
//     }
//     const existingBooking = await booking.findOne({
//       trainer: trainerId,
//       date,
//       timeSlot,
//     });
//     if (existingBooking) {
//       return res
//         .status(400)
//         .json({ Success: false, message: "This slot is already booked" });
//     }
//     const newBooking = await booking.create({
//       user: userId,
//       trainer: trainerId,
//       date,
//       timeSlot,
//     });

//     const emailSubject = `📅 New Booking Request from ${userData.name}`;
//     const emailText = `You have a new booking request from ${userData.name} (${userData.email}) on ${date} at ${timeSlot}.`;

//     const emailHTML = `
//     <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(to right, #f9f9f9, #e6f0ff); padding: 40px 20px;">
//       <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 16px; box-shadow: 0 8px 20px rgba(0,0,0,0.1); padding: 30px;">
//         <h2 style="text-align: center; color: #2C3E50; font-size: 28px; margin-bottom: 20px;">💪 New Booking Request!</h2>
//         <p style="font-size: 16px; color: #333;">
//           Hello <strong>${trainer.name}</strong>,
//         </p>
//         <p style="font-size: 16px; color: #333;">
//           You have received a new booking request from <strong>${userData.name}</strong> (<a href="mailto:${userData.email}" style="color: #3498DB;">${userData.email}</a>).
//         </p>
//         <div style="background: #f1f9ff; padding: 15px 20px; border-radius: 12px; margin: 20px 0; border-left: 5px solid #3498DB;">
//           <p style="margin: 0;"><strong>📅 Date:</strong> ${date}</p>
//           <p style="margin: 0;"><strong>⏰ Time Slot:</strong> ${timeSlot}</p>
//         </div>
//         <p style="font-size: 16px; color: #333;">Please log in to your dashboard to accept or reject the booking.</p>
//         <div style="text-align: center; margin-top: 30px;">
//           <a href="http://localhost:3000/booking" style="background: #3498DB; color: #fff; padding: 12px 30px; border-radius: 30px; text-decoration: none; font-weight: bold; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: background 0.3s ease;">
//             🔗 Go to Dashboard
//           </a>
//         </div>
//         <p style="font-size: 13px; color: #888; margin-top: 40px; text-align: center;">This is an automated message from <strong>FitApp</strong>. Please do not reply.</p>
//       </div>
//     </div>
//     `;

//     await sendMail(trainer.email, emailSubject, emailText, emailHTML);
//     res.status(201).json({
//       Success: true,
//       message: "Booking created Sucessfully",
//       newBooking,
//     });
//   } catch (err) {
//     console.log(err.message);
//     res.status(500).json({ Success: false, message: "Internal Server Error" });
//   }
// };


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
    const emailText = `You have a new booking request from ${userData.name} (${userData.email}) for ${date} at ${timeSlot}.\n\nManage your bookings: https://gymapp-frontend-1k6e.onrender.com/trainer-dashboard`;

    const emailHTML = `
    <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 40px 0;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
        <div style="background: linear-gradient(135deg, #3b82f6, #2563eb); padding: 30px 20px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 600;">New Booking Request</h1>
          <p style="margin-top: 8px; opacity: 0.9; font-size: 15px;">You've received a new session request</p>
        </div>
        
        <div style="padding: 32px;">
          <div style="margin-bottom: 24px;">
            <p style="margin: 0 0 16px 0; color: #64748b;">Hi <strong style="color: #1e293b;">${trainer.name}</strong>,</p>
            <p style="margin: 0; color: #64748b; line-height: 1.6;">
              <strong>${userData.name}</strong> has requested to book a training session with you. Here are the details:
            </p>
          </div>

          <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 24px; border: 1px solid #e2e8f0;">
            <h3 style="margin-top: 0; margin-bottom: 16px; color: #1e293b; font-size: 18px;">Session Details</h3>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
              <div>
                <p style="margin: 0; font-size: 13px; color: #64748b; font-weight: 500;">CLIENT NAME</p>
                <p style="margin: 4px 0 0 0; font-size: 15px; color: #1e293b; font-weight: 600;">${userData.name}</p>
              </div>
              <div>
                <p style="margin: 0; font-size: 13px; color: #64748b; font-weight: 500;">CLIENT EMAIL</p>
                <p style="margin: 4px 0 0 0; font-size: 15px; color: #1e293b; font-weight: 600;">
                  <a href="mailto:${userData.email}" style="color: #3b82f6; text-decoration: none;">${userData.email}</a>
                </p>
              </div>
              <div>
                <p style="margin: 0; font-size: 13px; color: #64748b; font-weight: 500;">DATE</p>
                <p style="margin: 4px 0 0 0; font-size: 15px; color: #1e293b; font-weight: 600;">${date}</p>
              </div>
              <div>
                <p style="margin: 0; font-size: 13px; color: #64748b; font-weight: 500;">TIME SLOT</p>
                <p style="margin: 4px 0 0 0; font-size: 15px; color: #1e293b; font-weight: 600;">${timeSlot}</p>
              </div>
            </div>
          </div>

          <div style="background-color: #eff6ff; border-radius: 8px; padding: 16px; margin-bottom: 24px; border: 1px solid #bfdbfe;">
            <h4 style="margin: 0 0 8px 0; color: #1e40af; font-size: 15px;">⏳ Action Required</h4>
            <p style="margin: 0; color: #64748b; font-size: 14px; line-height: 1.6;">
              Please accept or reject this booking request within 24 hours to confirm availability.
            </p>
          </div>

          <div style="text-align: center; margin-top: 32px;">
            <a href="https://gymapp-frontend-1k6e.onrender.com" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #2563eb); color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); transition: all 0.2s ease;">
              Manage Booking Requests
            </a>
          </div>
        </div>
        
        <div style="background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0;">© ${new Date().getFullYear()} GymApp Pro. All rights reserved.</p>
          <p style="margin: 8px 0 0 0;">Need help? Contact our support team at <a href="mailto:support@gymapp.com">Contact support</a></p>
        </div>
      </div>
    </div>
    `;

    await sendMail(trainer.email, emailSubject, emailText, emailHTML);
    res.status(201).json({
      Success: true,
      message: "Booking created successfully",
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

// export const updateBookingStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;
//     if (!["pending", "confirmed", "cancelled", "rejected"].includes(status)) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid status" });
//     }
//     const updated = await booking
//       .findByIdAndUpdate(id, { status }, { new: true })
//       .populate("user", "name email")
//       .populate("trainer", "name email");
//     if (!updated) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Booking not found" });
//     }

//     const subject = `📢 Your Booking Status Has Been Updated to "${status.toUpperCase()}"`;

//     const plainText = `Hello ${updated.user.name}, your booking with ${updated.trainer.name} on ${updated.date} at ${updated.timeSlot} is now marked as ${status}.`;

//     const html = `
//     <div style="font-family: 'Helvetica Neue', sans-serif; background: #f5f8fa; padding: 30px;">
//       <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 12px; padding: 25px 30px; box-shadow: 0 6px 16px rgba(0,0,0,0.1);">
//         <h2 style="text-align: center; color: #2c3e50;">📢 Booking Status Updated</h2>
//         <p style="font-size: 16px; color: #333;">Hi <strong>${
//           updated.user.name
//         }</strong>,</p>
//         <p style="font-size: 16px; color: #333;">
//           This is to inform you that your session booking with <strong>${
//             updated.trainer.name
//           }</strong> has been updated.
//         </p>

//         <div style="background: #ecf5ff; padding: 15px 20px; border-left: 5px solid #007BFF; border-radius: 10px; margin: 20px 0;">
//           <p style="margin: 0;"><strong>📅 Date:</strong> ${updated.date}</p>
//           <p style="margin: 0;"><strong>⏰ Time Slot:</strong> ${
//             updated.timeSlot
//           }</p>
//           <p style="margin: 0;"><strong>🚦 Status:</strong> 
//             <span style="color: ${
//               status === "confirmed"
//                 ? "#27ae60"
//                 : status === "cancelled"
//                 ? "#e74c3c"
//                 : status === "rejected"
//                 ? "#c0392b"
//                 : "#f39c12"
//             }; font-weight: bold; text-transform: capitalize;">${status}</span>
//           </p>
//         </div>

//         <p style="font-size: 16px;">You can log in to your dashboard to view more details or reschedule if needed.</p>

//         <div style="text-align: center; margin-top: 30px;">
//           <a href="https://your-app-dashboard.com/dashboard" style="background-color: #007BFF; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold;">🔗 View Dashboard</a>
//         </div>

//         <p style="font-size: 13px; color: #999; text-align: center; margin-top: 40px;">Thanks for choosing <strong>FitApp</strong> 💪</p>
//       </div>
//     </div>
//     `;

//     await sendMail(updated.user.email, subject, plainText, html);
//     res
//       .status(200)
//       .json({ success: true, message: "Status updated", booking: updated });
//   } catch (err) {
//     console.log(err.message);
//     res.status(500).json({ Success: false, message: "Internal Server Error" });
//   }
// };

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

    const statusColors = {
      confirmed: "#10b981",
      cancelled: "#ef4444",
      rejected: "#dc2626",
      pending: "#f59e0b"
    };

    const statusIcons = {
      confirmed: "✅",
      cancelled: "❌",
      rejected: "🚫",
      pending: "⏳"
    };

    const subject = `📢 Your Booking Status Has Been Updated to "${status.charAt(0).toUpperCase() + status.slice(1)}"`;

    const plainText = `Hello ${updated.user.name},\n\nYour booking with trainer ${updated.trainer.name} scheduled for ${updated.date} at ${updated.timeSlot} has been updated to status: ${status}.\n\nView your booking details: https://gymapp-frontend-1k6e.onrender.com/dashboard`;

    const html = `
    <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 40px 0;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
        <div style="background: linear-gradient(135deg, #3b82f6, #2563eb); padding: 30px 20px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 600;">Booking Status Update</h1>
          <p style="margin-top: 8px; opacity: 0.9; font-size: 15px;">${statusIcons[status]} Status changed to ${status.charAt(0).toUpperCase() + status.slice(1)}</p>
        </div>
        
        <div style="padding: 32px;">
          <div style="margin-bottom: 24px;">
            <p style="margin: 0 0 16px 0; color: #64748b;">Hi <strong style="color: #1e293b;">${updated.user.name}</strong>,</p>
            <p style="margin: 0; color: #64748b; line-height: 1.6;">Your training session booking status has been updated. Here are the details:</p>
          </div>

          <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 24px; border: 1px solid #e2e8f0;">
            <h3 style="margin-top: 0; margin-bottom: 16px; color: #1e293b; font-size: 18px;">Booking Information</h3>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
              <div>
                <p style="margin: 0; font-size: 13px; color: #64748b; font-weight: 500;">TRAINER</p>
                <p style="margin: 4px 0 0 0; font-size: 15px; color: #1e293b; font-weight: 600;">${updated.trainer.name}</p>
              </div>
              <div>
                <p style="margin: 0; font-size: 13px; color: #64748b; font-weight: 500;">DATE</p>
                <p style="margin: 4px 0 0 0; font-size: 15px; color: #1e293b; font-weight: 600;">${updated.date}</p>
              </div>
              <div>
                <p style="margin: 0; font-size: 13px; color: #64748b; font-weight: 500;">TIME SLOT</p>
                <p style="margin: 4px 0 0 0; font-size: 15px; color: #1e293b; font-weight: 600;">${updated.timeSlot}</p>
              </div>
              <div>
                <p style="margin: 0; font-size: 13px; color: #64748b; font-weight: 500;">STATUS</p>
                <p style="margin: 4px 0 0 0; font-size: 15px; color: ${statusColors[status]}; font-weight: 600; text-transform: capitalize;">${status}</p>
              </div>
            </div>
          </div>

          ${status === 'cancelled' || status === 'rejected' ? `
          <div style="background-color: #fef2f2; border-radius: 8px; padding: 16px; margin-bottom: 24px; border: 1px solid #fee2e2;">
            <h4 style="margin: 0 0 8px 0; color: #b91c1c; font-size: 15px;">⚠️ Important Notice</h4>
            <p style="margin: 0; color: #64748b; font-size: 14px; line-height: 1.6;">
              ${status === 'cancelled' 
                ? 'Your booking has been cancelled. You can schedule a new session in your dashboard.' 
                : 'Your booking request has been rejected. Please contact support if you have any questions.'}
            </p>
          </div>
          ` : ''}

          <div style="text-align: center; margin-top: 32px;">
            <a href="https://gymapp-frontend-1k6e.onrender.com" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #2563eb); color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); transition: all 0.2s ease;">
              View Booking Details
            </a>
          </div>
        </div>
        
        <div style="background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0;">© ${new Date().getFullYear()} GymApp Pro. All rights reserved.</p>
          <p style="margin: 8px 0 0 0;">Need assistance? Contact us at alphabu;k14@gmail.com</p>
        </div>
      </div>
    </div>
    `;

    await sendMail(updated.user.email, subject, plainText, html);
    res.status(200).json({ 
      success: true, 
      message: "Booking status updated and notification sent", 
      booking: updated 
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
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
import { userMembership } from "../models/usermembership.model.js";
import { MembershipPlan } from "../models/membership.model.js";
import { user } from "../models/user.model.js";
import sendMail from "../utils/sendMail.js";

// export const createMembership = async (req, res) => {
//   try {
//     const { membershipPlanId } = req.body;
//     console.log("membershipPlanId",membershipPlanId)
//     const userId = req.user._id;
//     const plan = await MembershipPlan.findById(membershipPlanId);
//     if (!plan) {
//       return res
//         .status(404)
//         .json({ Success: "false", messge: "Plan Not found!" });
//     }
//     const startDate = new Date();
//     const endDate = new Date();
//     endDate.setMonth(startDate.getMonth() + plan.duration);

//     console.log("Start Date is:", startDate);
//     console.log("End Date:", endDate);
//     const membership = new userMembership({
//       userId,
//       membershipPlanId,
//       paymentStatus: "Success",
//       startDate,
//       endDate,
//     });
//     await membership.save();
//     // Fetch user email - assuming you have a User model
//     const existingUser = await user.findById(userId);
//     console.log("Existing user is:", existingUser);
//     if (existingUser && existingUser.email) {
//       const subject = "Welcome to Your New Membership Plan!";
//       const text = `Hello,

// Thank you for subscribing to the ${plan.name} plan.

// Your membership starts on ${startDate.toDateString()} and ends on ${endDate.toDateString()}.

// Enjoy your journey with us!

// Best regards,
// The Team`;

//       const html = `
//   <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; padding: 30px; border-radius: 10px; color: #333; max-width: 600px; margin: auto;">
//     <div style="background-color: #4CAF50; color: white; padding: 15px 20px; border-radius: 8px 8px 0 0;">
//       <h2 style="margin: 0;">🎉 Welcome to Your New Membership Plan!</h2>
//     </div>
//     <div style="background-color: white; padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
//       <p style="font-size: 16px;">Hi <strong>${
//         existingUser.name || "Member"
//       }</strong>,</p>
      
//       <p style="font-size: 15px;">Thank you for subscribing to the <strong style="color: #4CAF50;">${
//         plan.name
//       }</strong> plan. We're thrilled to support you on your fitness journey 💪.</p>
      
//       <div style="background-color: #f1f8e9; padding: 15px; border-radius: 8px; margin: 20px 0;">
//         <h4 style="margin-top: 0;">📅 Membership Details:</h4>
//         <ul style="padding-left: 20px;">
//           <li><strong>Start Date:</strong> ${startDate.toDateString()}</li>
//           <li><strong>End Date:</strong> ${endDate.toDateString()}</li>
//         </ul>
//       </div>

//       <p style="font-size: 15px;">We’re here to support and motivate you. Get ready to smash your goals! 🚀</p>
      
//       <p style="margin-top: 30px; font-size: 15px;">Warm wishes,<br/><strong style="color: #4CAF50;">The GymApp Team</strong></p>
//     </div>
//   </div>
// `;

//       await sendMail(existingUser.email, subject, text, html);
//     }

//     res.status(200).json({
//       Success: true,
//       message: "Membership Created Successfully",
//       membership,
//     });
//   } catch (err) {
//     console.log(err.message);
//     res.status(500).json({ Success: false, msg: "Internal server error" });
//   }
// };


// export const createMembership = async (req, res) => {
//   try {
//     const { membershipPlanId } = req.body;
//     console.log("membershipPlanId", membershipPlanId);
//     const userId = req.user._id;
//     const plan = await MembershipPlan.findById(membershipPlanId);
//     if (!plan) {
//       return res
//         .status(404)
//         .json({ Success: "false", message: "Plan Not found!" });
//     }
//     const startDate = new Date();
//     const endDate = new Date();
// console.log("membershipPlanId:", membershipPlanId);
// console.log("User ID:", userId);
// console.log("Plan found:", plan);
// console.log("Start Date:", startDate);
// console.log("End Date:", endDate);

//     endDate.setMonth(startDate.getMonth() + plan.duration);

   
//     const membership = new userMembership({
//       userId,
//       membershipPlanId,
//       paymentStatus: "Success",
//       startDate,
//       endDate,
//     });
//     await membership.save();
    
//     // Fetch user email
//     const existingUser = await user.findById(userId);
//     console.log("Existing user is:", existingUser);
    
//     if (existingUser && existingUser.email) {
//       const subject = `🎉 Welcome to Your ${plan.name} Membership!`;
//       const text = `Hello ${existingUser.name || "Member"},

// Thank you for subscribing to the ${plan.name} plan at GymApp!

// Your membership details:
// - Start Date: ${startDate.toDateString()}
// - End Date: ${endDate.toDateString()}

// Access your membership dashboard: https://gymapp-frontend-1k6e.onrender.com/membership

// We're excited to support your fitness journey!

// Best regards,
// The GymApp Team`;

//       const html = `
// <!DOCTYPE html>
// <html>
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Welcome to Your Membership</title>
//     <style>
//         @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        
//         body {
//             font-family: 'Poppins', sans-serif;
//             margin: 0;
//             padding: 0;
//             background-color: #f8fafc;
//         }
        
//         .container {
//             max-width: 600px;
//             margin: 20px auto;
//             background: #ffffff;
//             border-radius: 12px;
//             overflow: hidden;
//             box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
//         }
        
//         .header {
//             background: linear-gradient(135deg, #10b981 0%, #059669 100%);
//             padding: 30px 20px;
//             text-align: center;
//             color: white;
//         }
        
//         .header h1 {
//             margin: 0;
//             font-size: 24px;
//             font-weight: 700;
//         }
        
//         .content {
//             padding: 30px;
//             color: #334155;
//         }
        
//         .logo {
//             text-align: center;
//             margin-bottom: 20px;
//         }
        
//         .user-greeting {
//             font-size: 18px;
//             margin-bottom: 20px;
//         }
        
//         .membership-details {
//             background-color: #f0fdf4;
//             padding: 20px;
//             border-radius: 8px;
//             margin: 25px 0;
//             border-left: 4px solid #10b981;
//         }
        
//         .membership-details h3 {
//             margin-top: 0;
//             color: #065f46;
//         }
        
//         .detail-item {
//             margin-bottom: 10px;
//             display: flex;
//         }
        
//         .detail-label {
//             font-weight: 600;
//             min-width: 100px;
//             color: #065f46;
//         }
        
//         .cta-button {
//             display: block;
//             text-align: center;
//             background: linear-gradient(135deg, #10b981 0%, #059669 100%);
//             color: white;
//             text-decoration: none;
//             padding: 14px 28px;
//             border-radius: 8px;
//             font-weight: 600;
//             font-size: 16px;
//             margin: 30px auto;
//             width: fit-content;
//             box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
//             transition: all 0.3s ease;
//         }
        
//         .cta-button:hover {
//             transform: translateY(-2px);
//             box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
//         }
        
//         .footer {
//             text-align: center;
//             padding: 20px;
//             font-size: 14px;
//             color: #64748b;
//             background-color: #f8fafc;
//             border-top: 1px solid #e2e8f0;
//         }
        
//         .footer a {
//             color: #10b981;
//             text-decoration: none;
//         }
//     </style>
// </head>
// <body>
//     <div class="container">
//         <div class="header">
//             <h1>🎉 Welcome to Your ${plan.name} Membership!</h1>
//         </div>
        
//         <div class="content">
//             <div class="logo">
//                 <span style="font-size: 24px; font-weight: 700; color: #10b981;">GYMAPP</span>
//             </div>
            
//             <div class="user-greeting">
//                 <p>Hi <strong>${existingUser.name || "Member"}</strong>,</p>
//             </div>
            
//             <p>Thank you for choosing the <strong>${plan.name}</strong> plan. We're excited to be part of your fitness journey!</p>
            
//             <div class="membership-details">
//                 <h3>Your Membership Details</h3>
//                 <div class="detail-item">
//                     <span class="detail-label">Plan:</span>
//                     <span>${plan.name}</span>
//                 </div>
//                 <div class="detail-item">
//                     <span class="detail-label">Start Date:</span>
//                     <span>${startDate.toDateString()}</span>
//                 </div>
//                 <div class="detail-item">
//                     <span class="detail-label">End Date:</span>
//                     <span>${endDate.toDateString()}</span>
//                 </div>
//                 <div class="detail-item">
//                     <span class="detail-label">Duration:</span>
//                     <span>${plan.duration} month${plan.duration > 1 ? 's' : ''}</span>
//                 </div>
//             </div>
            
//             <p>You now have access to all the benefits of your membership. We can't wait to see your progress!</p>
            
//             <a href="https://gymapp-frontend-1k6e.onrender.com/membership/all" class="cta-button">
//                 Access Your Membership Dashboard
//             </a>
            
//             <p>If you have any questions about your membership, please don't hesitate to contact our support team.</p>
//         </div>
        
//         <div class="footer">
//             <p>© ${new Date().getFullYear()} GymApp. All rights reserved.</p>
//             <p><a href="https://gymapp-frontend-1k6e.onrender.com">Visit our website</a> | <a href="mailto:alphabulk14@gmail.com">Contact support</a></p>
//         </div>
//     </div>
// </body>
// </html>
//       `;

//       await sendMail(existingUser.email, subject, text, html);
//     }

//     res.status(201).json({
//       success: true,
//       message: "Membership Created Successfully",
//       membership,
//     });
//   } catch (err) {
//     console.log(err.message);
//     res.status(500).json({ Success: false, msg: "Internal server error" });
//   }
// };

export const createMembership = async (req, res) => {
  try {
    const { membershipPlanId } = req.body;
    console.log("membershipPlanId", membershipPlanId);
    const userId = req.user._id;

    const plan = await MembershipPlan.findById(membershipPlanId);
    if (!plan) {
      return res.status(404).json({
        Success: "false",
        message: "Plan Not found!",
      });
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(startDate.getMonth() + plan.duration);

    // Debug logs
    console.log("membershipPlanId:", membershipPlanId);
    console.log("User ID:", userId);
    console.log("Plan found:", plan);
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);

    const membership = new userMembership({
      userId,
      membershipPlanId,
      paymentStatus: "Success",
      startDate,
      endDate,
    });

    await membership.save();

    // Fetch user email
    const existingUser = await user.findById(userId);
    console.log("Existing user is:", existingUser);

    if (existingUser && existingUser.email) {
      const subject = `🎉 Welcome to Your ${plan.name} Membership!`;
      const text = `Hello ${existingUser.name || "Member"},

Thank you for subscribing to the ${plan.name} plan at GymApp!

Your membership details:
- Start Date: ${startDate.toDateString()}
- End Date: ${endDate.toDateString()}

Access your membership dashboard: https://gymapp-frontend-1k6e.onrender.com/membership

We're excited to support your fitness journey!

Best regards,
The GymApp Team`;

        const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Your Membership</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        
        body {
            font-family: 'Poppins', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f8fafc;
        }
        
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }
        
        .header {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            padding: 30px 20px;
            text-align: center;
            color: white;
        }
        
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
        }
        
        .content {
            padding: 30px;
            color: #334155;
        }
        
        .logo {
            text-align: center;
            margin-bottom: 20px;
        }
        
        .user-greeting {
            font-size: 18px;
            margin-bottom: 20px;
        }
        
        .membership-details {
            background-color: #f0fdf4;
            padding: 20px;
            border-radius: 8px;
            margin: 25px 0;
            border-left: 4px solid #10b981;
        }
        
        .membership-details h3 {
            margin-top: 0;
            color: #065f46;
        }
        
        .detail-item {
            margin-bottom: 10px;
            display: flex;
        }
        
        .detail-label {
            font-weight: 600;
            min-width: 100px;
            color: #065f46;
        }
        
        .cta-button {
            display: block;
            text-align: center;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            margin: 30px auto;
            width: fit-content;
            box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
            transition: all 0.3s ease;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
        }
        
        .footer {
            text-align: center;
            padding: 20px;
            font-size: 14px;
            color: #64748b;
            background-color: #f8fafc;
            border-top: 1px solid #e2e8f0;
        }
        
        .footer a {
            color: #10b981;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Welcome to Your ${plan.name} Membership!</h1>
        </div>
        
        <div class="content">
            <div class="logo">
                <span style="font-size: 24px; font-weight: 700; color: #10b981;">GYMAPP</span>
            </div>
            
            <div class="user-greeting">
                <p>Hi <strong>${existingUser.name || "Member"}</strong>,</p>
            </div>
            
            <p>Thank you for choosing the <strong>${plan.name}</strong> plan. We're excited to be part of your fitness journey!</p>
            
            <div class="membership-details">
                <h3>Your Membership Details</h3>
                <div class="detail-item">
                    <span class="detail-label">Plan:</span>
                    <span>${plan.name}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Start Date:</span>
                    <span>${startDate.toDateString()}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">End Date:</span>
                    <span>${endDate.toDateString()}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Duration:</span>
                    <span>${plan.duration} month${plan.duration > 1 ? 's' : ''}</span>
                </div>
            </div>
            
            <p>You now have access to all the benefits of your membership. We can't wait to see your progress!</p>
            
            <a href="https://gymapp-frontend-1k6e.onrender.com/membership/all" class="cta-button">
                Access Your Membership Dashboard
            </a>
            
            <p>If you have any questions about your membership, please don't hesitate to contact our support team.</p>
        </div>
        
        <div class="footer">
            <p>© ${new Date().getFullYear()} GymApp. All rights reserved.</p>
            <p><a href="https://gymapp-frontend-1k6e.onrender.com">Visit our website</a> | <a href="mailto:alphabulk14@gmail.com">Contact support</a></p>
        </div>
    </div>
</body>
</html>
      `;

      try {
        await sendMail(existingUser.email, subject, text, html);
        console.log("✅ Email sent to:", existingUser.email);
      } catch (emailErr) {
        console.error("❌ Email sending failed:", emailErr.message);
        // Don't fail the whole request if email fails
      }
    }

    res.status(201).json({
      success: true,
      message: "Membership Created Successfully",
      membership,
    });
  } catch (err) {
    console.error("🔥 createMembership error:", err.message);
    res.status(500).json({ Success: false, msg: "Internal server error", error: err.message });
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
    const membership = await userMembership.find({}).populate("userId","name role").populate("membershipPlanId","name");
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

import mongoose from "mongoose";

// const planDetails = {
//   Basic: {
//     duration: 1, // duration in months
//     price: 499,
//     benefits: ["Access to gym during off-peak hours", "Free diet consultation"],
//   },
//   Elite3: {
//     duration: 3,
//     price: 1299,
//     benefits: [
//       "24/7 Gym Access",
//       "Free personal trainer session (monthly)",
//       "Group fitness classes",
//     ],
//   },
//   Elite6: {
//     duration: 6,
//     price: 2299,
//     benefits: [
//       "24/7 Gym Access",
//       "Bi-weekly personal trainer sessions",
//       "Access to yoga and Zumba",
//       "Free fitness assessment",
//     ],
//   },
//     Elite9: {
//     duration: 9,
//     price: 3599,
//     benefits: [
//       "24/7 Gym Access",
//       "Bi-weekly personal trainer sessions",
//       "Access to yoga and Zumba",
//       "Free fitness assessment",
//       "Priority customer support",
//     ],
//   },
//   Pro: {
//     duration: 12,
//     price: 3999,
//     benefits: [
//       "Unlimited Gym Access",
//       "Weekly personal trainer sessions",
//       "Custom nutrition plan",
//       "Priority customer support",
//       "Free gym merchandise",
//     ],
//   },
// };
const membershipSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    unique: true,
    trim: true,
  },
  duration: {
    type: Number,
  },
  price: {
    type: Number,
  },
  benefits: {
    type: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});


// membershipSchema.pre("save", function (next) {
//   const plan = planDetails[this.name];
//   if (plan) {
//     this.duration = plan.duration;
//     this.price = plan.price;
//     this.benefits = plan.benefits;
//   }
//   next();
// });

export const MembershipPlan = mongoose.model(
  "MembershipPlan",
  membershipSchema
);

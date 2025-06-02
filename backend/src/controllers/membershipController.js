import { MembershipPlan } from "../models/membership.model.js";

export const getAllMembershipPlans = async (req, res) => {
  try {
    const plans = await MembershipPlan.find({});
    res.status(200).send({ success: true, plans });
  } catch (err) {
    console.log("Internal Server error:", err.message);
    res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};

export const createMembership = async (req, res) => {
  try {
    const { name, duration, price, benefits } = req.body;

    // Check if plan already exists
    const exists = await MembershipPlan.findOne({ name });
    if (exists) {
      return res
        .status(400)
        .json({ success: false, message: "Plan Already Exists" });
    }

    // Create new plan
    const newPlan = new MembershipPlan({ name, duration, price, benefits });
    await newPlan.save();

    res
      .status(201)
      .json({ success: true, message: "New Plan Created", newPlan });
  } catch (err) {
    console.error("Error creating plan:", err);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const updateMembership = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, benefits, price, duration } = req.body;
    const plan = await MembershipPlan.findById(id);
    if (!plan) {
      return res
        .status(404)
        .json({ success: false, message: "Plan Not Found!" });
    }
    if(name) plan.name = name;
    if(benefits) plan.benefits = benefits; // expecting array
    if(price) plan.price = price;
    if(duration) plan.duration = duration;
    plan.save();
    res.status(200).json({ success: true, message: "Plan Updated Sucessfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Interval Server Error" });
  }
};

export const deleteMembership = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await MembershipPlan.findByIdAndDelete(id);
    if (!plan) {
      return res
        .status(404)
        .json({ success: false, message: "Plan Not Found!" });
    }
    res.status(200).json({ success: true, message: "Plan Deleted Sucesfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Interval Server Error" });
  }
};

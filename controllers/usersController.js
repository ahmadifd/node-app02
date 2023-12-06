import User from "../models/User.js";
import jwt from "jsonwebtoken";
import controller from "../routes/controller.js";

const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password").lean();
  if (!users?.length) {
    return controller.response({ res, status: 400, message: "No users found" });
  }

  controller.response({ data: users });
};

export default { getAllUsers };

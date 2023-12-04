import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const login = async (req, res) => {
  const { username, password } = req.body;
  const foundUser = await User.findOne({ username }).exec();
  console.log(foundUser);
  res.json(foundUser);
};

const refresh = (req, res) => {};

export default { login, refresh };

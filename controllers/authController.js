import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import controller from "../routes/controller.js";

export default new (class extends controller {
  async login(req, res) {
    const { username, password } = req.body;
    const foundUser = await User.findOne({ username }).exec();
    console.log(foundUser);
    res.json(foundUser);
  }

  refresh(req, res) {}
})();

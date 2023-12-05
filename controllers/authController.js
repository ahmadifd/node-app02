import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import controller from "../routes/controller.js";

const login = async (req, res) => {
  const { username, password } = req.body;

  const foundUser = await User.findOne({ username }).exec();

  if (!foundUser || !foundUser.active) {
    return controller.response({ res, message: "Unauthorized", status: 401 });
  }

  const match = await bcrypt.compare(password, foundUser.password);
  if (!match)
    return controller.response({ res, message: "Unauthorized", status: 401 });

  const accessToken = jwt.sign(
    {
      UserInfo: {
        username: foundUser.username,
        roles: foundUser.roles,
      },
    },
    "sdfjhj234t2fwd0982i34rf23feoijf042SDF",
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { username: foundUser.username },
    "sdfjhj432t2fwd0982i43rf23feoijf024SDF",
    { expiresIn: "1d" }
  );
  foundUser.refreshToken = refreshToken;
  const result = await foundUser.save();
  console.log(refreshToken);

  res.cookie("jwt", refreshToken, {
    httpOnly: true, //accessible only by web server
    secure: true, //https
    sameSite: "None", //cross-site cookie
    maxAge: 1 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
  });

  setTimeout(() => {
    return controller.response({
      res,
      status: 200,
      data: { accessToken },
    });
  }, 1000);
};

const register = async (req, res) => {
  const { firstname, lastname, email, username, password, roles } = req.body;
  const duplicate = await User.findOne({ username });
  if (duplicate) {
    return controller.response({
      res,
      status: 409,
      message: "Duplicate username",
    });
  }
  const hashedPwd = await bcrypt.hash(password, 10);
  const userObject =
    !Array.isArray(roles) || !roles.length
      ? { firstname, lastname, email, username, password: hashedPwd }
      : { firstname, lastname, email, username, password: hashedPwd, roles };

  const user = await User.create(userObject);

  if (user) {
    controller.response({
      res,
      status: 201,
      message: `New user ${username} created`,
      data: user,
    });
  } else {
    controller.response({
      res,
      status: 201,
      message: "Invalid user data received",
    });
  }
};

const refresh = (req, res) => {};

export default { login, refresh, register };

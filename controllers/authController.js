import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import controller from "../routes/controller.js";

const login = async (req, res) => {
  const { userName, password } = req.body;

  const foundUser = await User.findOne({ userName }).exec();

  if (!foundUser || !foundUser.active) {
    return controller.response({ res, message: "Unauthorized", status: 401 });
  }

  const match = await bcrypt.compare(password, foundUser.password);
  console.log(match);
  if (!match)
    return controller.response({ res, message: "Unauthorized", status: 401 });

  const accessToken = jwt.sign(
    {
      UserInfo: {
        userName: foundUser.userName,
        roles: foundUser.roles,
      },
    },
    "sdfjhj234t2fwd0982i34rf23feoijf042SDF",
    { expiresIn: "500s" }
  );

  const refreshToken = jwt.sign(
    { userName: foundUser.userName },
    "sdfjhj432t2fwd0982i43rf23feoijf024SDF",
    { expiresIn: "1d" }
  );
  foundUser.refreshToken = refreshToken;
  const result = await foundUser.save();

  res.cookie("jwt", refreshToken, {
    httpOnly: true, //accessible only by web server
    secure: true, //https
    sameSite: "None", //cross-site cookie
    maxAge: 1 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
  });

  //setTimeout(() => {
  return controller.response({
    res,
    status: 200,
    data: { accessToken },
  });
  //}, 1000);
};

const register = async (req, res) => {
  const { firstName, lastName, email, userName, password, roles } = req.body;
  const duplicate = await User.findOne({ userName });
  if (duplicate) {
    return controller.response({
      res,
      status: 409,
      message: "Duplicate userName",
    });
  }
  const hashedPwd = await bcrypt.hash(password, 10);
  const rowNumber = (await User.count()) + 1;
  const userObject =
    !Array.isArray(roles) || !roles.length
      ? { firstName, lastName, email, userName, password: hashedPwd, rownumber }
      : {
          firstName,
          lastName,
          email,
          userName,
          password: hashedPwd,
          roles,
          rownumber,
        };

  const user = await User.create(userObject);

  if (user) {
    controller.response({
      res,
      status: 201,
      message: `New user ${userName} created`,
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

const refresh = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt)
    return controller.response({
      res,
      status: 401,
      message: "Unauthorized - jwt cookies does'nt exist",
    });

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    "sdfjhj432t2fwd0982i43rf23feoijf024SDF",
    async (err, decode) => {
      if (err)
        return controller.response({ res, status: 403, message: "Forbidden" });

      const foundUser = await User.findOne({ refreshToken }).exec();

      if (!foundUser || foundUser.userName !== decode.userName)
        return controller.response({
          res,
          status: 403,
          message: "Forbidden",
        });

      const accessToken = jwt.sign(
        {
          UserInfo: {
            userName: foundUser.userName,
            roles: foundUser.roles,
          },
        },
        "sdfjhj234t2fwd0982i34rf23feoijf042SDF",
        { expiresIn: "500s" }
      );

      return controller.response({
        res,
        status: 200,
        data: { accessToken },
      });
    }
  );
};

const logout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return controller.response({ res, status: 204 });
  const refreshToken = cookies.jwt;
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie("jwt", {
      httpOnly: false,
      //sameSite: 'None',
      secure: false,
    });
    return controller.response({ res, status: 204 });
  }

  foundUser.refreshToken = "";
  const result = await foundUser.save();

  res.clearCookie("jwt", {
    httpOnly: false,
    //sameSite: 'None',
    secure: false,
  });

  controller.response({ res, message: "Cookie cleared" });
};

export default { login, refresh, register, logout };

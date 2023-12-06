import jwt from "jsonwebtoken";
import controller from "../routes/controller.js";

export const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer "))
    return controller.response({ res, status: 401 });

  const token = authHeader.split(" ")[1];

  jwt.verify(token, 'sdfjhj234t2fwd0982i34rf23feoijf042SDF', (err, decoded) => {
    if (err) return controller.response({res,status:403})
    req.user = decoded.UserInfo.username;
    req.roles = decoded.UserInfo.roles;
    next();
  });
};

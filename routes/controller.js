import { validationResult } from "express-validator";
import User from "../models/User.js";

const validationBody = (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errors = result.array();
    const messages = [];
    errors.forEach((err) => messages.push(err.msg));
    res.status(400).json({
      message: "validation error",
      data: messages,
    });
    return false;
  }
  return true;
};

const validate = (req, res, next) => {
   if (!validationBody(req, res)) {
     return;
   }
  next();
};

const response = ({ res, message, status = 200, data = {} }) => {
  res.status(status).json({
    message,
    data,
  });
};

export default { validationBody, validate, response };

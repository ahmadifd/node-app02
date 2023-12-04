import express from "express";
import loginLimiter from "../middleware/loginLimiter.js";
import validator from "./auth/validator.js";
import authController from "../controllers/authController.js";
import controller from "../routes/controller.js";

const router = express.Router();

router
  .route("/")
  .post(
    loginLimiter,
    validator.loginValidator(),
    controller.validate,
    authController.login
  );

export default router;

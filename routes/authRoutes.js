import express from "express";
import loginLimiter from "../middleware/loginLimiter.js";
import validator from "./auth/validator.js";
import controller from "../controllers/authController.js";

const router = express.Router();

router
  .route("/")
  .post(
    loginLimiter,
    validator.loginValidator(),
    controller.validate.bind(controller),
    controller.login
  );

export default router;

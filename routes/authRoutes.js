import express from "express";
import loginLimiter from "../middleware/loginLimiter.js";
import validator from "./auth/validator.js";
import authController from "../controllers/authController.js";
import controller from "../routes/controller.js";

const router = express.Router();

router
  .route("/register")
  .post(
    validator.registerValidator(),
    controller.validate,
    authController.register
  );

router
  .route("/login")
  .post(
    loginLimiter,
    validator.loginValidator(),
    controller.validate,
    authController.login
  );

router.route("/refresh").get(authController.refresh);

router.route("/logout").post(authController.logout);

export default router;

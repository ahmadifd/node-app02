import express from "express";
import { verifyJWT } from "../middleware/verifyJWT.js";
import usersController from "../controllers/usersController.js";
import { verifyRoles } from "../middleware/verifyRoles.js";
import ROLES_LIST from "../config/roles_list.js";
import validator from "./auth/validator.js";

const router = express.Router();

router.use(verifyJWT);

router
  .route("/")
  .post(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Manager),
    usersController.getDataGridUsers
  );

router
  .route("/addUser")
  .post(
    validator.AddUserValidator(),
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Manager),
    usersController.addUser
  );

export default router;

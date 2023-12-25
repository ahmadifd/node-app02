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
    validator.addUserValidator(),
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Manager),
    usersController.addUser
  );

router.route("/:id").get(
  // (req, res, next) => {
  //   console.log(req.body);
  //   next();
  // },
  validator.getUserValidator(),
  verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Manager),
  usersController.getUser
);

export default router;

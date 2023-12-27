import express from "express";
import { verifyJWT } from "../middleware/verifyJWT.js";
import usersController from "../controllers/usersController.js";
import { verifyRoles } from "../middleware/verifyRoles.js";
import ROLES_LIST from "../config/roles_list.js";
import validator from "./auth/validator.js";
import controller from "../routes/controller.js";

const router = express.Router();

router.use(verifyJWT);

router
  .route("/")
  .post(
    validator.addUserValidator(),
    controller.validate,
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Manager),
    usersController.addUser
  )
  .patch(
    validator.editUserValidator(),
    controller.validate,
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Manager),
    usersController.editUser
  )
  .delete(
    validator.deleteUserValidator(),
    controller.validate,
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Manager),
    usersController.deleteUser
  );

  router
  .route("/changeActiveFieldForUser")
  .patch(
    validator.changeActiveFieldForUserValidator(),
    controller.validate,
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Manager),
    usersController.changeActiveFieldForUser
  );

router
  .route("/getDataGridUsers")
  .post(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Manager),
    usersController.getDataGridUsers
  );

router
  .route("/:id")
  .get(
    validator.getUserValidator(),
    controller.validate,
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Manager),
    usersController.getUser
  );

export default router;

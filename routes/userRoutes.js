import express from "express";
import { verifyJWT } from "../middleware/verifyJWT.js";
import usersController from "../controllers/usersController.js";
import { verifyRoles } from "../middleware/verifyRoles.js";
import ROLES_LIST from "../config/roles_list.js";

const router = express.Router();

router.use(verifyJWT);

router
  .route("/")
  .post(
    verifyRoles(ROLES_LIST.Admin),
     usersController.getDataGridUsers);

export default router;

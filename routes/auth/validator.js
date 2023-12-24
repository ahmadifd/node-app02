import expressValidator from "express-validator";

const check = expressValidator.check;

const registerValidator = () => {
  return [
    check("firstName").not().isEmpty().withMessage("firstName cant be empty"),
    check("lastName").not().isEmpty().withMessage("lastName cant be empty"),
    check("email").isEmail().withMessage("email is invalid"),
    check("userName").not().isEmpty().withMessage("username cant be empty"),
    check("password").not().isEmpty().withMessage("password cant be empty"),
    check("roles").not().isEmpty().withMessage("roles cant be empty"),
    check("active").not().isEmpty().withMessage("active cant be empty"),
  ];
};

const loginValidator = () => {
  return [
    //check("email").isEmail().withMessage("email is invalid"),
    check("userName").not().isEmpty().withMessage("userName cant be empty"),
    check("password").not().isEmpty().withMessage("password cant be empty"),
  ];
};

const addUserValidator = () => {
  return [
    check("firstName").not().isEmpty().withMessage("firstName cant be empty"),
    check("lastName").not().isEmpty().withMessage("lastName cant be empty"),
    check("email").isEmail().withMessage("email is invalid"),
    check("userName").not().isEmpty().withMessage("username cant be empty"),
    check("password").not().isEmpty().withMessage("password cant be empty"),
    check("roles").not().isEmpty().withMessage("roles cant be empty"),
    check("active").not().isEmpty().withMessage("active cant be empty"),
  ];
};

const getUserValidator = () => {
  return [check("id").not().isEmpty().withMessage("id cant be empty")];
};
export default {
  loginValidator,
  registerValidator,
  addUserValidator,
  getUserValidator,
};

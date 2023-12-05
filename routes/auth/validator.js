import expressValidator from "express-validator";

const check = expressValidator.check;

const registerValidator = () => {
  return [
    check("firstname").not().isEmpty().withMessage("firstname cant be empty"),
    check("lastname").not().isEmpty().withMessage("lastname cant be empty"),
    check("email").isEmail().withMessage("email is invalid"),
    check("username").not().isEmpty().withMessage("username cant be empty"),
    check("password").not().isEmpty().withMessage("password cant be empty"),
  ];
};

const loginValidator = () => {
  return [
    //check("email").isEmail().withMessage("email is invalid"),
    check("username").not().isEmpty().withMessage("username cant be empty"),
    check("password").not().isEmpty().withMessage("password cant be empty"),
  ];
};

export default { loginValidator, registerValidator };

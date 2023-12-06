import controller from "../routes/controller.js";

export const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles) return controller.response({ res, status: 401 });
    const rolesArray = [...allowedRoles];
    const result = req.roles
      .map((role) => rolesArray.includes(role))
      .find((val) => val === true);
    if (!result) return controller.response({ res, status: 401 });
    next();
  };
};

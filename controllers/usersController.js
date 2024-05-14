import User from "../models/User.js";
import jwt from "jsonwebtoken";
import controller from "../routes/controller.js";
import bcrypt from "bcrypt";

const queryFilter = (filter) => {
  switch (filter.filterType) {
    case "contains":
      return { [filter.key]: { $regex: filter.value } };
    case "equals":
      return { [filter.key]: filter.value };
    case "startsWith":
      return { [filter.key]: { $regex: `^${filter.value}` } };
    case "endsWith":
      return { [filter.key]: { $regex: `${filter.value}$` } };
    case "isEmpty":
      return { [filter.key]: "" };
    case "isNotEmpty":
      return { [filter.key]: { $exists: true, $ne: "" } };
    case "isAnyOf":
      return { [filter.key]: filter.value };
    case "is":
      return { [filter.key]: filter.value };
    case "=":
      return { [filter.key]: filter.value };
    case "!=":
      return { [filter.key]: { $ne: filter.value } };
    case ">":
      return { [filter.key]: { $gt: filter.value } };
    case ">=":
      return { [filter.key]: { $gte: filter.value } };
    case "<":
      return { [filter.key]: { $lt: filter.value } };
    case "<=":
      return { [filter.key]: { $lte: filter.value } };
  }
};

const queryQuickSearch = (quickSearch) => {
  const srch = {
    $or: [
      {
        firstName: { $regex: quickSearch },
      },
      {
        lastName: { $regex: quickSearch },
      },
      {
        userName: { $regex: quickSearch },
      },
      {
        email: { $regex: quickSearch },
      },
    ],
  };

  return srch;
};

const getDataGridUsers = async (req, res) => {
  console.log(req?.body);

  if (req?.body?.pageNumber === undefined)
    return controller.response({
      res,
      status: 400,
      message: "Error pageNumber",
    });
  const pageNumber = req?.body?.pageNumber;
  const filter = req?.body?.filter;
  const sort = req?.body?.sort;
  const quickSearch = req?.body?.quickSearch;
  const pageSize = req?.body?.pageSize;

  /////////////////////////////////////////////////////////////////////////

  if (filter) {
    let filterType = filter.filterType;
    let filterKey = filter.key;
    let filterValue = filter.value;
    console.log(
      "filterType",
      filterType,
      "filterKey",
      filterKey,
      "filterValue",
      filterValue
    );

    const obj1 = { firstName: "Farshid" };
    const value = "Farshid";
    let result = await User.aggregate([
      {
        $match: {
          firstName: value,
        },
      },
    ]);
    console.log(Object.keys(obj1)[0], Object.values(obj1)[0]);
    console.log(result);
  }

  ////////////////////////////////////////////////////////////////////////
  let qry = {};
  let srt = {};
  if (filter !== undefined && filter) {
    qry = { ...qry, ...queryFilter(filter) };
  }
  if (quickSearch !== undefined && quickSearch) {
    qry = { $and: [qry, queryQuickSearch(quickSearch)] };
  }

  if (sort !== undefined && sort) {
    if (sort.value == "asc") {
      srt = { [sort.key]: 1 };
    } else if (sort.value == "desc") {
      srt = { [sort.key]: -1 };
    }
  }

  let users = {};
  let totalCount = await User.count(qry);
  let fromIndex = pageNumber * pageSize;
  if (totalCount >= fromIndex + pageSize) {
    users = await User.find(qry)
      .sort(srt)
      .skip(fromIndex)
      .limit(pageSize + 1)
      .select("-password")
      .lean();
  } else {
    users = await User.find(qry)
      .sort(srt)
      .skip(fromIndex)
      .limit(totalCount - fromIndex)
      .select("-password")
      .lean();
  }

  ////////////////////////////////////////////////////////////////////////

   controller.response({ res, data: { users, totalCount } });
};

const addUser = async (req, res) => {
  const { firstName, lastName, email, userName, password, roles, active } =
    req.body;
  const duplicate = await User.findOne({ userName });
  if (duplicate) {
    return controller.response({
      res,
      status: 409,
      message: "Duplicate userName",
    });
  }
  console.log(firstName, lastName, email, userName, password, roles);
  const hashedPwd = await bcrypt.hash(password, 10);
  const rowNumber = (await User.count()) + 1;
  const userObject =
    !Array.isArray(roles) || !roles.length
      ? { firstName, lastName, email, userName, password: hashedPwd, rowNumber }
      : {
          firstName,
          lastName,
          email,
          userName,
          password: hashedPwd,
          roles,
          rowNumber,
          active,
        };

  const user = await User.create(userObject);

  if (user) {
    controller.response({
      res,
      status: 201,
      message: `New user ${userName} created`,
      data: user,
    });
  } else {
    controller.response({
      res,
      status: 201,
      message: "Invalid user data received",
    });
  }
};

const editUser = async (req, res) => {
  const { id, firstName, lastName, email, userName, password, roles, active } =
    req.body;

  // Does the user exist to update?
  const user = await User.findById(id).exec();

  if (!user) {
    return controller.response({ res, status: 400, message: "User not found" });
  }

  // Check for duplicate
  const duplicate = await User.findOne({ userName })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  // Allow updates to the original user
  if (duplicate && duplicate?._id.toString() !== id) {
    return controller.response({
      res,
      status: 409,
      message: "Duplicate userName",
    });
  }

  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;
  user.userName = userName;
  user.roles = roles;
  user.active = active;

  if (password) {
    // Hash password
    user.password = await bcrypt.hash(password, 10); // salt rounds
  }

  const updatedUser = await user.save();

  controller.response({
    res,
    status: 201,
    message: `${updatedUser.userName} updated`,
    data: updatedUser,
  });
};

const getUser = async (req, res) => {
  console.log(req?.params);
  if (req?.params?.id === undefined)
    return controller.response({
      res,
      status: 400,
      message: "Error id",
    });
  const id = req?.params?.id;
  const findUser = await User.findOne({ _id: id }).select("-password").lean();
  if (!findUser) {
    return controller.response({
      res,
      status: 204,
      message: `No User matches ID ${id}.`,
    });
  }
  controller.response({
    res,
    status: 200,
    data: findUser,
  });
};

const deleteUser = async (req, res) => {
  console.log("deleteUser");
  const { id } = req.body;

  // Does the user exist to delete?
  const user = await User.findById(id).exec();

  if (!user) {
    return controller.response({ res, status: 400, message: "User not found" });
  }

  const result = await user.deleteOne();

  controller.response({
    res,
    status: 200,
    message: `Username ${user.userName} deleted`,
  });
};

const changeActiveFieldForUser = async (req, res) => {
  const { id, active } = req.body;

  // Does the user exist to update?
  const user = await User.findById(id).exec();

  if (!user) {
    return controller.response({ res, status: 400, message: "User not found" });
  }
  user.active = active;

  const updatedUser = await user.save();

  controller.response({
    res,
    status: 201,
    message: `${updatedUser.userName} updated`,
    data: updatedUser,
  });
};

export default {
  getDataGridUsers,
  addUser,
  getUser,
  editUser,
  deleteUser,
  changeActiveFieldForUser,
};

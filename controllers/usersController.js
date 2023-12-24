import User from "../models/User.js";
import jwt from "jsonwebtoken";
import controller from "../routes/controller.js";
import bcrypt from "bcrypt";

const queryFilter = (qFilter, filter) => {
  switch (filter.filterType) {
    case "contains":
      return qFilter.find({
        [filter.key]: { $regex: filter.value },
      });

      break;
    case "equals":
      return qFilter.find({
        [filter.key]: filter.value,
      });
      break;
    case "startsWith":
      return qFilter.find({
        [filter.key]: { $regex: `^${filter.value}` },
      });
      break;
    case "endsWith":
      return qFilter.find({
        [filter.key]: { $regex: `${filter.value}$` },
      });
      break;
    case "isEmpty":
      return qFilter.find({
        [filter.key]: "",
      });
      break;
    case "isNotEmpty":
      return qFilter.find({
        [filter.key]: { $exists: true, $ne: "" },
      });
      break;
    case "isAnyOf":
      return qFilter.find({
        [filter.key]: filter.value,
      });
      break;
    case "is":
      return qFilter.find({
        [filter.key]: filter.value,
      });
      break;
    case "=":
      return qFilter.find({
        [filter.key]: filter.value,
      });
      break;
    case "!=":
      return qFilter.find({
        [filter.key]: { $ne: filter.value },
      });
      break;
    case ">":
      return qFilter.find({
        [filter.key]: { $gt: filter.value },
      });
      break;
    case ">=":
      return qFilter.find({
        [filter.key]: { $gte: filter.value },
      });
      break;
    case "<":
      return qFilter.find({
        [filter.key]: { $lt: filter.value },
      });
      break;
    case "<=":
      return qFilter.find({
        [filter.key]: { $lte: filter.value },
      });
      break;
  }
};

const queryQuickSearch = (qFilter, quickSearch) => {
  return qFilter.find({
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
  });
};

const query = (qFilter, fromIndex, pageSize) => {
  return qFilter.skip(fromIndex).limit(pageSize).select("-password").lean();
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

  ////////////////////////////////////////////////////////////////////////
  let users;
  let usersTemp;
  let usersCountTemp;
  let nextCursor;
  let totalCount;
  let fromIndex;

  if (filter !== undefined || sort !== undefined || quickSearch !== undefined) {
    usersTemp = User.find();
    usersCountTemp = User.find();

    if (filter) {
      usersTemp = queryFilter(usersTemp, filter);
      usersCountTemp = queryFilter(usersCountTemp, filter);
    }

    if (quickSearch) {
      usersTemp = queryQuickSearch(usersTemp, quickSearch);
      usersCountTemp = queryQuickSearch(usersCountTemp, quickSearch);
    }

    if (sort) {
      if (sort.value == "asc") {
        usersTemp = usersTemp.sort({ [sort.key]: 1 });
        usersCountTemp = usersCountTemp.sort({ [sort.key]: 1 });
      } else if (sort.value == "desc") {
        usersTemp = usersTemp.sort({ [sort.key]: -1 });
        usersCountTemp = usersCountTemp.sort({ [sort.key]: -1 });
      }
    }

    totalCount = await usersCountTemp.count();
    fromIndex = pageNumber * pageSize;
    if (totalCount >= fromIndex + pageSize) {
      const result = await query(usersTemp, fromIndex, pageSize + 1);
      users = result.slice(0, pageSize);
      nextCursor = result.slice(pageSize);
    } else {
      users = await query(usersTemp, fromIndex, totalCount - fromIndex);
    }
  } else {
    totalCount = await User.count();
    users = await User.find().select("-password").lean();
    fromIndex = pageNumber * pageSize;
    if (totalCount >= fromIndex + pageSize) {
      const result = await User.find()
        .skip(fromIndex)
        .limit(pageSize + 1)
        .select("-password")
        .lean();
      users = result.slice(0, pageSize);
      nextCursor = result.slice(pageSize);
    } else {
      users = await User.find()
        .skip(fromIndex)
        .limit(totalCount - fromIndex);
    }
  }

  ////////////////////////////////////////////////////////////////////////

  // if (!users?.length) {
  //   return controller.response({ res, status: 400, message: "No users found" });
  // }

  controller.response({ res, data: { users, totalCount, nextCursor } });
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

export default { getDataGridUsers, addUser };

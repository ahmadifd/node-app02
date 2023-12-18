import User from "../models/User.js";
import jwt from "jsonwebtoken";
import controller from "../routes/controller.js";

const queryFilter = (qFilter, filter) => {
  if (["active"].includes(filter.key)) {
    switch (filter.filterType) {
      case "contains":
        return qFilter.find({
          [filter.key]: "false".startsWith(filter.value) ? 0 : 1,
        });
      case "equals":
        
      case "startsWith":
      case "endsWith":
      case "isEmpty":
      case "isNotEmpty":
      case "isAnyOf":
    }
  }
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
  }
};

const queryQuickSearch = (qFilter, quicksearch) => {
  return qFilter.find({
    $or: [
      {
        firstname: { $regex: quicksearch },
      },
      {
        lastname: { $regex: quicksearch },
      },
      {
        username: { $regex: quicksearch },
      },
      {
        email: { $regex: quicksearch },
      },
    ],
  });
};

const query = (qFilter, fromindex, pagesize) => {
  return qFilter.skip(fromindex).limit(pagesize).select("-password").lean();
};

const getDataGridUsers = async (req, res) => {
  console.log(req?.body);

  if (req?.body?.pagenumber === undefined)
    return controller.response({
      res,
      status: 400,
      message: "Error pagenumber",
    });
  const pagenumber = req?.body?.pagenumber;
  const filter = req?.body?.filter;
  const sort = req?.body?.sort;
  const quicksearch = req?.body?.quicksearch;
  const pagesize = req?.body?.pagesize;

  ////////////////////////////////////////////////////////////////////////
  let users;
  let usersTemp;
  let usersCountTemp;
  let nextCursor;
  let totalCount;
  let fromindex;

  if (filter !== undefined || sort !== undefined || quicksearch !== undefined) {
    usersTemp = User.find();
    usersCountTemp = User.find();
    if (filter) {
      usersTemp = queryFilter(usersTemp, filter);
      usersCountTemp = queryFilter(usersCountTemp, filter);
    }
    if (quicksearch) {
      usersTemp = queryQuickSearch(usersTemp, quicksearch);
      usersCountTemp = queryQuickSearch(usersCountTemp, quicksearch);
    }
    if (sort) {
      //number
      if (sort.key === "id") {
        if (sort.value == "asc") {
          // filterUsersData = filterUsersData.sort((x, y) => x.id - y.id);
        } else if (sort.value == "desc") {
          //filterUsersData = filterUsersData.sort((x, y) => y.id - x.id);
        }
      }
      //boolean
      else if (sort.key === "active") {
        if (sort.value == "asc") {
          usersTemp = usersTemp.sort({ [sort.key]: 1 });
          usersCountTemp = usersCountTemp.sort({ [sort.key]: 1 });
        } else if (sort.value == "desc") {
          usersTemp = usersTemp.sort({ [sort.key]: -1 });
          usersCountTemp = usersCountTemp.sort({ [sort.key]: -1 });
        }
      }
      //string
      else if (
        ["firstname", "lastname", "username", "email"].includes(sort.key)
      ) {
        if (sort.value == "asc") {
          {
            usersTemp = usersTemp.sort({ [sort.key]: 1 });
            usersCountTemp = usersCountTemp.sort({ [sort.key]: 1 });
          }
        } else if (sort.value == "desc") {
          {
            usersTemp = usersTemp.sort({ [sort.key]: -1 });
            usersCountTemp = usersCountTemp.sort({ [sort.key]: -1 });
          }
        }
      }
    }

    totalCount = await usersCountTemp.count();
    fromindex = pagenumber * pagesize;
    if (totalCount >= fromindex + pagesize) {
      const result = await query(usersTemp, fromindex, pagesize + 1);
      users = result.slice(0, pagesize);
      nextCursor = result.slice(pagesize);
    } else {
      users = await query(usersTemp, fromindex, totalCount - fromindex);
    }
  } else {
    totalCount = await User.count();
    users = await User.find().select("-password").lean();
    fromindex = pagenumber * pagesize;
    if (totalCount >= fromindex + pagesize) {
      const result = await User.find()
        .skip(fromindex)
        .limit(pagesize + 1)
        .select("-password")
        .lean();
      users = result.slice(0, pagesize);
      nextCursor = result.slice(pagesize);
    } else {
      users = await User.find()
        .skip(fromindex)
        .limit(totalCount - fromindex);
    }
  }

  ////////////////////////////////////////////////////////////////////////

  // if (!users?.length) {
  //   return controller.response({ res, status: 400, message: "No users found" });
  // }

  controller.response({ res, data: { users, totalCount, nextCursor } });
};

export default { getDataGridUsers };

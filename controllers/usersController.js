import User from "../models/User.js";
import jwt from "jsonwebtoken";
import controller from "../routes/controller.js";

const query = (filter, fromindex, pagesize) => {
  switch (filter.filterType) {
    case "contains":
      return User.find({
        [filter.key]: { $regex: filter.value },
      })
        .skip(fromindex)
        .limit(pagesize)
        .select("-password")
        .lean();
      break;
    case "equals":
      return User.find({
        [filter.key]: filter.value,
      })
        .skip(fromindex)
        .limit(pagesize)
        .select("-password")
        .lean();
      break;
    case "startsWith":
      return User.find({
        [filter.key]: { $regex: `^${filter.value}` },
      })
        .skip(fromindex)
        .limit(pagesize)
        .select("-password")
        .lean();
      break;
    case "endsWith":
      return User.find({
        [filter.key]: { $regex: `${filter.value}$` },
      })
        .skip(fromindex)
        .limit(pagesize)
        .select("-password")
        .lean();
      break;
    case "isEmpty":
      return User.find({
        [filter.key]: "",
      })
        .skip(fromindex)
        .limit(pagesize)
        .select("-password")
        .lean();
      break;
    case "isNotEmpty":
      return User.find({
        [filter.key]: { $exists: true, $ne: "" },
      })
        .skip(fromindex)
        .limit(pagesize)
        .select("-password")
        .lean();
      break;
    case "isAnyOf":
      return User.find({
        [filter.key]: filter.value,
      })
        .skip(fromindex)
        .limit(pagesize)
        .select("-password")
        .lean();
      break;
  }
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
  let nextCursor;
  let totalCount;
  let fromindex;

  if (filter !== undefined || sort !== undefined || quicksearch !== undefined) {
    if (filter) {
      totalCount = await query(filter).count();
      users = await query(filter).select("-password").lean();
      fromindex = pagenumber * pagesize;
      if (totalCount >= fromindex + pagesize) {
        users = await query(filter, fromindex, pagesize);
        nextCursor = await query(filter, fromindex + pagesize, 1);
      } else {
        users = await query(filter, fromindex, totalCount - fromindex);
      }
    }
  } else {
    totalCount = await User.count();

    users = await User.find().select("-password").lean();

    fromindex = pagenumber * pagesize;
    if (totalCount >= fromindex + pagesize) {
      users = await User.find()
        .skip(fromindex)
        .limit(pagesize)
        .select("-password")
        .lean();

      nextCursor = await User.find()
        .skip(fromindex + pagesize)
        .limit(1);
    } else {
      users = await User.find()
        .skip(fromindex)
        .limit(totalCount - fromindex);
    }
  }

  console.log(totalCount, fromindex);

  return controller.response({ res, data: { users, totalCount, nextCursor } });

  ////////////////////////////////////////////////////////////////////////

  //const users = await User.find().select("-password").lean();

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
        // filterUsersData = filterUsersData.sort(
        //   (x, y) => (x.active ? 1 : 0) - (y.active ? 1 : 0)
        // );
      } else if (sort.value == "desc") {
        // filterUsersData = filterUsersData.sort(
        //   (x, y) => (y.active ? 1 : 0) - (x.active ? 1 : 0)
        // );
      }
    }
    //string
    else if (
      ["firstname", "lastname", "username", "email"].includes(sort.key)
    ) {
      if (sort.value == "asc") {
        {
          // filterUsersData = filterUsersData.sort((x, y) =>
          //   x[sort.key].toString().localeCompare(y[sort.key].toString())
          // );
        }
      } else if (sort.value == "desc") {
        {
          // filterUsersData = filterUsersData.sort((x, y) =>
          //   y[sort.key].toString().localeCompare(x[sort.key].toString())
          // );
        }
      }
    }
  }

  //quicksearch
  if (quicksearch) {
    // filterUsersData = filterUsersData.filter(
    //   (x) =>
    //     x.firstname.includes(quicksearch) ||
    //     x.lastname.includes(quicksearch) ||
    //     x.username.includes(quicksearch) ||
    //     x.email.includes(quicksearch)
    // );
  }

  if (!users?.length) {
    return controller.response({ res, status: 400, message: "No users found" });
  }

  controller.response({ res, data: { users, totalCount } });
};

export default { getDataGridUsers };

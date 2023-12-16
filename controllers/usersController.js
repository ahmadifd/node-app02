import User from "../models/User.js";
import jwt from "jsonwebtoken";
import controller from "../routes/controller.js";

const getDataGridUsers = async (req, res) => {
  console.log(req?.body);

  if (!req?.body?.pagenumber)
    return controller.response({
      res,
      status: 400,
      message: "Error pagenumber",
    });
  const filter = req?.body?.filter;
  const sort = req?.body?.sort;
  const quicksearch = req?.body?.quicksearch;
  const pagesize = req?.body?.pagesize;

  ////////////////////////////////////////////////////////////////////////
   let users;
   let nextCursor;

   const length = await User.count();
  // const fromindex = pagenumber * pagesize;
  // if (length >= fromindex + pagesize) {
     users = await User.find()
  //     .skip(fromindex + pagesize)
  //     .limit(pagesize);

  //   nextCursor = await User.find()
  //     .skip(fromindex + pagesize)
  //     .limit(1);
  // } else {
  //   const endindex = length;
  //   users = await User.find()
  //     .skip(fromindex)
  //     .limit(length - endindex);
  // }
   const totalCount = users?.length;

   //console.log(length,users);

  return controller.response({ res, data: { users, totalCount, nextCursor } });

  ////////////////////////////////////////////////////////////////////////

  //const users = await User.find().select("-password").lean();

  if (filter) {
    switch (filter.filterType) {
      case "contains":
        users = await User.find((x) =>
          x[filter.key].toString().includes(filter?.value)
        )
          .select("-password")
          .lean();
        break;
      case "equals":
        break;
      case "startsWith":
        break;
      case "endsWith":
        break;
      case "isEmpty":
        break;
      case "isNotEmpty":
        break;
      case "isAnyOf":
        break;
    }
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

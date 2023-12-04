import mongoose from "mongoose";

const userShema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    type: [String],
    default: ["User"],
  },
  active: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model("User", userShema);

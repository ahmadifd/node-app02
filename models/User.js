import mongoose from "mongoose";
import timestamp from "mongoose-timestamp";

const userShema = new mongoose.Schema({
  firstname: {
    type: String,
    require: true,
  },
  lastname: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
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
  refreshToken: String,
});

userShema.plugin(timestamp);

export default mongoose.model("User", userShema);

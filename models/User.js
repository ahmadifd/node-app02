import mongoose from "mongoose";
import timestamp from "mongoose-timestamp";

const userSchema = new mongoose.Schema({
  rowNumber: {
    type: Number,
    require: true,
  },
  firstName: {
    type: String,
    require: true,
  },
  lastName: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  userName: {
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

userSchema.plugin(timestamp);

export default mongoose.model("User", userSchema);

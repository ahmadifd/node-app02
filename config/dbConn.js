import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/node-app02");
  } catch (err) {
    console.log(err);
  }
};

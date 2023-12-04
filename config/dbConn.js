import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/node-app02");
  } catch (err) {
    console.log(err);
  }
};

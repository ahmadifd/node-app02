import express from "express";
import mongoose from "mongoose";
import { connectDB } from "./config/dbConn.js";
import authRoutes from "./routes/authRoutes.js";

const PORT = process.env.PORT || 3500;

const app = express();

connectDB();

app.use(express.json());

app.use("/auth", authRoutes);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

// const app = express();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// await mongoose
//   .connect(
//     //"mongodb://root:XMBjo2J0QUCl9dRu@services.irn1.chabokan.net:2039/CompanyDB"eee
//     "mongodb+srv://ahmadifd:47mcOiksjZjyvH1Y@cluster0.jad41dh.mongodb.net/CompanyDB"
//   )
//   .then(async () => {
//     console.log("connected");
//   })
//   .catch((err) => console.log("not connected", err));

// app.get("/api/users", (req, res) => {
//   console.log("Hello Farshid");
//   res.send("Hello Farshid Ahmadi 1");
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`listen to ${PORT}`);
// });

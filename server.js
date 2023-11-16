import express from "express";
//import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// await mongoose
//   .connect(
//     //"mongodb://root:XMBjo2J0QUCl9dRu@services.irn1.chabokan.net:2039/CompanyDB"
//     "mongodb+srv://ahmadifd:47mcOiksjZjyvH1Y@cluster0.jad41dh.mongodb.net/CompanyDB"
//   )
//   .then(async () => {
//     console.log("connected");
//   })
//   .catch((err) => console.log("not connected", err));

app.get("/api/users", (req, res) => {
  console.log("Hello Farshid");
  res.send("Hello Farshid Ahmadi");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`listen to ${PORT}`);
});

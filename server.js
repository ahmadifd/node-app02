import express from "express";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


await mongoose
  .connect(
    "mongodb://root:XMBjo2J0QUCl9dRu@services.irn1.chabokan.net:2039/CompanyDB"
  )
  .then(async () => {
    console.log("connected");
  })
  .catch((err) => console.log("not connected", err));

app.get("/api/users", (req, res) => {
  console.log("Hello Farshid");
  res.send("Hello Farshid");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`listen to ${PORT}`);
});

import express from "express";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", () => {
  console.log("hello");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`listen to ${PORT}`);
});

const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookie = require("cookie-parser");
const body = require("body-parser");
const DB_connect = require("./DataBase/Db");
const userRouter = require("./Routes/UserRoute");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookie());
app.use(body());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.get("/", async (req, res) => {
  res.send("server is working");
});

app.use("/api/auth", userRouter);

app.listen(process.env.PORT, () => {
  console.log(`server is working on http://localhost:${process.env.PORT}/`);
});

DB_connect();

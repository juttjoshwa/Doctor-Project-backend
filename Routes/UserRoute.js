const jwt = require("jsonwebtoken");
const express = require("express");
const { Register, Login, Logout, getMyDetails } = require("../Controllers/User-Controller");

const requireAuth = async (req, res, next) => {
  const token = req.cookies.token;
  const secretToken = process.env.CODE_JWT || "juttjoshwa@gmail.com";

  if (!token) {
    return res
      .status(401)
      .json({ message: "Please log in to access this resource" });
  }
  try {
    const decodedToken = await jwt.verify(token, secretToken);
    req.user = decodedToken;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const userRouter = express.Router();
userRouter.post("/register", Register);
userRouter.post("/login", Login);
userRouter.get("/logout", Logout);
userRouter.get("/me", requireAuth, getMyDetails);

module.exports = userRouter;

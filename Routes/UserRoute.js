const jwt = require("jsonwebtoken"); // JWT library for token handling
const express = require("express"); // Express framework for creating the router
const { Register, Login, Logout, getMyDetails } = require("../Controllers/User-Controller"); // Import user controllers

const CODE_JWT = "juttjoshwa"; // Secret key for JWT token

// Middleware function for requiring authentication with JWT token
const requireAuth = async (req, res, next) => {
  const token = req.cookies.token; // Extract token from the cookie in the request
  const secretToken = CODE_JWT; // Secret key for verifying the token

  if (!token) {
    // If the token is not present, return a 401 Unauthorized response
    return res
      .status(401)
      .json({ message: "Please log in to access this resource" });
  }
  try {
    // Verify the token using the secret key
    const decodedToken = await jwt.verify(token, secretToken);
    req.user = decodedToken; // Set the decoded token as part of the request object
    next(); // Move to the next middleware or route handler
  } catch (err) {
    // If the token verification fails, return a 401 Unauthorized response
    return res.status(401).json({ message: "Invalid token" });
  }
};

const userRouter = express.Router(); // Create an instance of the Express router

// Define routes and associate them with the corresponding controller functions
userRouter.post("/register", Register);
userRouter.post("/login", Login);
userRouter.get("/logout", Logout);
userRouter.get("/me", requireAuth, getMyDetails);

module.exports = userRouter; // Export the userRouter containing the defined routes

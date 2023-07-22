const jwt = require("jsonwebtoken"); // JWT library for token handling
const ExpressAsyc = require("express-async-handler"); // Express wrapper for handling async functions
const UserSchema = require("../model/UserSchema.js"); // User schema/model for database operations
const bcrypt = require("bcryptjs"); // Library for hashing passwords

const CODE_JWT = "juttjoshwa"; // Secret key for JWT token

// Function to send a JWT token in a response
const sendingToken = (statusCode, user, res) => {
  const tokenForAuth = jwt.sign(
    {
      id: user.id,
    },
    CODE_JWT,
    {
      expiresIn: "1d",
    }
  );

  const expires = 1;
  const options = {
    expires: new Date(Date.now() + expires * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: true,
  };
  res.status(statusCode).cookie("token", tokenForAuth, options).json({
    success: true,
    user,
    tokenForAuth,
  });
};

exports.Register = ExpressAsyc(async (req, res) => {
  try {
    const { name, email, password, phone, bloodType, gender } = req.body; // Extract user data from request body
    const emailCheck = await UserSchema.findOne({ email }); // Check if the email is already registered

    if (emailCheck) {
      // If the email is already registered, return a 409 Conflict response
      return res.status(409).json({
        success: false,
        message: "You Already have an Account",
      });
    }

    const salt = await bcrypt.genSalt(10); // Generate a salt for password hashing
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password

    const user = await UserSchema.create({
      name,
      email,
      password: hashedPassword,
      phone,
      bloodType,
      gender,
    }); // Create a new user with hashed password
    return sendingToken(200, user, res); // Send a JWT token in the response
  } catch (error) {
    const errorMessage = error.message || "Something went wrong";
    return res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
});

exports.Login = ExpressAsyc(async (req, res) => {
  try {
    const { email, password } = req.body; // Extract email and password from request body

    if (!email || !password) {
      // If email or password is missing, return a 404 Not Found response
      return res.status(404).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const user = await UserSchema.findOne({ email }).select("+password"); // Find the user by email and include the hashed password

    if (!user) {
      // If the user is not found, return a 401 Unauthorized response
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password); // Compare the provided password with the hashed password

    if (!isPasswordMatched) {
      // If the password does not match, return a 401 Unauthorized response
      return res.status(401).json({
        success: false,
        message: "Enter correct password!",
      });
    }

    return sendingToken(201, user, res); // Send a JWT token in the response
  } catch (error) {
    const errorMessage = error.message || "Something went wrong";
    return res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
});

exports.Logout = ExpressAsyc(async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()), // Set the cookie expiration to the current date to remove it
    httpOnly: true, // Set the cookie as httpOnly to prevent client-side access
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

exports.getMyDetails = ExpressAsyc(async (req, res, next) => {
  try {
    const user = await UserSchema.findById(req.user.id).select("-password"); // Find the user by ID and exclude the password field from the result
    const newUser = user;

    res.status(200).json({
      success: true,
      newUser,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

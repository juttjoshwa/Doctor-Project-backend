const jwt = require("jsonwebtoken");
const ExpressAsyc = require("express-async-handler");
const UserSchema = require("../model/UserSchema.js");
const bcrypt = require("bcryptjs");

const CODE_JWT = "juttjoshwa";

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
    sameSite: "None",
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
    const { name, email, password, phone, bloodType, gender } = req.body;
    const emailCheck = await UserSchema.findOne({ email });
    if (emailCheck) {
      return res.status(409).json({
        success: false,
        message: "You Already have an Account",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await UserSchema.create({
      name,
      email,
      password: hashedPassword,
      phone,
      bloodType,
      gender,
    });
    return sendingToken(200, user, res);
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
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(404).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const user = await UserSchema.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: "Enter correct password!",
      });
    }

    return sendingToken(201, user, res);
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
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

exports.getMyDetails = ExpressAsyc(async (req, res, next) => {
  try {
    const user = await UserSchema.findById(req.user.id).select("-password");
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

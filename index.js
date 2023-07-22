// Import required modules and libraries
const express = require("express"); // Express framework for creating the server
require("dotenv").config(); // Load environment variables from .env file
const cors = require("cors"); // CORS middleware for handling Cross-Origin Resource Sharing
const cookie = require("cookie-parser"); // Cookie parser middleware for handling cookies
const DB_connect = require("./DataBase/Db"); // Database connection module
const userRouter = require("./Routes/UserRoute"); // Router for user-related routes

const app = express(); // Create an instance of the Express application

app.use(express.json()); // Middleware for parsing JSON data in the request body
app.use(express.urlencoded({ extended: true })); // Middleware for parsing URL-encoded data in the request body
app.use(cookie()); // Middleware for parsing cookies from the request

app.use(
  cors({
    origin: "https://doctor-frontend-six.vercel.app", // Allow requests from this origin
    credentials: true, // Allow sending cookies in cross-origin requests
  })
);

app.get("/", async (req, res) => {
  res.send("server is working"); // Route handler for the root URL
});

app.use("/api/auth", userRouter); // Mount the userRouter to handle '/api/auth' requests

app.listen(process.env.PORT, () => {
  console.log(`server is working on http://localhost:${process.env.PORT}/`); // Start the server and log a message to indicate that the server is running
});

DB_connect(); // Connect to the database

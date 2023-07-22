const mongoose = require("mongoose"); // Mongoose library for MongoDB interactions

const DB_URL = "mongodb+srv://doctor:doctor1@cluster0.trwczml.mongodb.net/Doctor?retryWrites=true&w=majority"; // MongoDB Atlas connection URL

// Function to connect to the MongoDB database
const DB_connect = () => {
  mongoose
    .connect(DB_URL, {
      useNewUrlParser: true, // Use the new URL parser
      useUnifiedTopology: true, // Use the new server discovery and monitoring engine
    })
    .then((res) => {
      console.log("Db Connected"); // Log a success message if the connection is successful
    })
    .catch((err) => {
      console.log(err.message); // Log the error message if the connection fails
    });
};

module.exports = DB_connect; // Export the DB_connect function to be used in other modules

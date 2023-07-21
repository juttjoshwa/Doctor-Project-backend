const mongoose = require("mongoose");

const DB_URL = "mongodb+srv://doctor:doctor1@cluster0.trwczml.mongodb.net/Doctor?retryWrites=true&w=majority"

const DB_connect = () => {
  mongoose
    .connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((res) => {
      console.log("Db Connected");
    })
    .catch((err) => {
      console.log(err.message);
    });
};

module.exports = DB_connect;

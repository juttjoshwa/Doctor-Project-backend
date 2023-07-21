const mongoose = require("mongoose");

const DB_connect = () => {
  mongoose
    .connect(process.env.DB_URL, {
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

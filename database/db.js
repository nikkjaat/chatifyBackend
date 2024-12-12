const mongoose = require("mongoose");

const mongoConnect = async () => {
  await mongoose.connect(
    "mongodb+srv://chatify:nikhil123@cluster0.nbgb9.mongodb.net/"
  );
  console.log("Connected to Database successfully");
};

module.exports = mongoConnect;

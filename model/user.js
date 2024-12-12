const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
  },
  number: {
    type: Number,
    required: true,
    unique: true,
    minlength: 10,
    maxlength: 12,
  },
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 100,
  },

  resetToken: String,
  resetTokenExpiration: String,
});

module.exports = mongoose.model("user", UserSchema);

const mongoose = require("mongoose");
const { Schema } = mongoose;

// const phoneNumberRegex = /^\+?[1-9]\d{1,14}$/; // Global E.164 format

// const validatePhoneNumber = (phoneNumber) => {
//   return phoneNumberRegex.test(phoneNumber);
// };

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
  },
  number: {
    type: String,
    unique: [true, "Phone number is already in use."],
    default: "",
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    maxlength: 50,
  },
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
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
  resetTokenExpiration: Date,
  imageURL: {
    type: String,
    default: "",
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
  lastSeen: {
    type: Date,
    default: Date.now,
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  avatar: {
    type: String,
    default: "default-avatar.png",
  },
  bio: {
    type: String,
    maxlength: 160,
  },
});

// UserSchema.pre("save", function (next) {
//   if (this.phoneNumber) {
//     this.phoneNumber = this.phoneNumber.trim();
//   }
//   next();
// });

module.exports = mongoose.model("user", UserSchema);

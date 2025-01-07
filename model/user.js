// const mongoose = require("mongoose");
// const { Schema } = mongoose;

// const UserSchema = new Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true,
//     minlength: 3,
//     maxlength: 20,
//   },
//   number: {
//     type: Number,
//     required: true,
//     unique: true,
//     minlength: 10,
//     maxlength: 12,
//   },
//   username: {
//     type: String,
//     required: true,
//     trim: true,
//     minlength: 3,
//     maxlength: 20,
//   },
//   password: {
//     type: String,
//     required: true,
//     minlength: 8,
//     maxlength: 100,
//   },

//   resetToken: String,
//   resetTokenExpiration: String,
// });

// module.exports = mongoose.model("user", UserSchema);

const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
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
      default: "/uploads/images/profile.png", // Optional URL for profile picture
    },

    isOnline: {
      type: Boolean,
      default: false, // Tracks online status
    },
    lastSeen: {
      type: Date,
      default: Date.now, // Timestamp for last activity
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user", // Reference to other users
      },
    ],
    avatar: {
      type: String, // Optional URL for profile picture
      default: "default-avatar.png",
    },
    bio: {
      type: String, // Optional bio/description
      maxlength: 160,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", UserSchema);

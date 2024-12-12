const mongoose = require("mongoose");
const { Schema } = mongoose;

const MessageSchema = new Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    messages: [
      { type: mongoose.Schema.Types.ObjectId, ref: "messages", default: [] },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("convarsation", MessageSchema);

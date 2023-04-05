const mongoose = require("mongoose");

const Message = mongoose.model(
  "Message",
  new mongoose.Schema(
    {
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      text: {
        type: String,
      },
      file: {
        type: String,
      },
    },
    { timestamps: true, collection: "messages" }
  )
);

module.exports = Message;

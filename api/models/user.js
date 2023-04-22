const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema(
    {
      type: {
        type: String,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      username: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
      image: {
        type: String,
      },
    },
    { timestamps: true, collection: "users" }
  )
);

module.exports = User;

const mongoose = require("mongoose");

const ResetVerification = mongoose.model(
  "ResetVerification",
  new mongoose.Schema(
    {
      userId: {
        type: String,
      },
      uniqueString: {
        type: String,
      },
      createdAt: {
        type: Date,
      },
      expiresAt: {
        type: Date,
      },
    },
    { collection: "reset-verifications" }
  )
);

module.exports = ResetVerification;

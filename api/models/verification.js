const mongoose = require("mongoose");

const Verification = mongoose.model(
  "Verification",
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
    { collection: "verifications" }
  )
);

module.exports = Verification;

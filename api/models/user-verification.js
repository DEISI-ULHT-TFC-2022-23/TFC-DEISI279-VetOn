const mongoose = require("mongoose");

const UserVerification = mongoose.model(
    "UserVerification",
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
        { collection: "user-verifications" }
    )
);

module.exports = UserVerification;

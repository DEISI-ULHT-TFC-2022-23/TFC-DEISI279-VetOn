const mongoose = require("mongoose");

const Appointment = mongoose.model(
    "Appointment",
    new mongoose.Schema(
        {
            pet: {
                type: String,
                required: true,
            },
            date: {
                type: String,
                required: true,
            },
            description: {
                type: String,
                required: true,
            },
        },
        { timestamps: true, collection: "appointments" }
    )
);

module.exports = Appointment;

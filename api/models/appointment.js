const mongoose = require("mongoose");

const Appointment = mongoose.model(
  "Appointment",
  new mongoose.Schema(
    {
      clinic: {
        type: String,
        required: true,
      },
      pet: {
        type: String,
        required: true,
      },
      appointmentType: {
        type: String,
        required: true,
      },
      doctor: {
        type: String,
        required: true,
      },
      hour: {
        type: String,
        required: true,
      },
      owner: {
        type: String,
        required: true,
      },
    },
    { timestamps: true, collection: "appointments" }
  )
);

module.exports = Appointment;

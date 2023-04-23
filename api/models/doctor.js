const mongoose = require("mongoose");

const Doctor = mongoose.model(
  "Doctor",
  new mongoose.Schema(
    {
      image: {
        type: String,
      },
      job: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      appointmentHours: [
        {
          date: Date,
          hours: Array,
        },
      ],
      fb: {
        type: String,
      },
      li: {
        type: String,
      },
      insta: {
        type: String,
      },
    },
    { timestamps: true, collection: "doctors" }
  )
);

module.exports = Doctor;

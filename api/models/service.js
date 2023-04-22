const mongoose = require("mongoose");

const Service = mongoose.model(
  "Service",
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
    },
    { timestamps: true, collection: "services" }
  )
);

module.exports = Service;

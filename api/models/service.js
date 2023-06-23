const mongoose = require("mongoose");

const Service = mongoose.model(
  "Service",
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },
      image: {
        type: [],
      },
    },
    { timestamps: true, collection: "services" }
  )
);

module.exports = Service;

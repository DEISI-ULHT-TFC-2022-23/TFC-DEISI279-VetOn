const mongoose = require("mongoose");

const Animal = mongoose.model(
    "Animal",
    new mongoose.Schema(
        {
            name: {
                type: String,
                required: true,
            },
            type: {
                type: String,
                required: true,
            },
            race: {
                type: String,
                required: true,
            },
            weight: {
                type: String,
                required: true,
            },
            gender: {
                type: String,
                required: true,
            },
            birth_date: {
                type: String,
                required: true,
            },
            skin_type: {
                type: String,
                required: true,
            },
            image: {
                type: String,
            },
            owner_id: {
                type: String,
            },
        },
        { timestamps: true, collection: "animals" }
    )
);

module.exports = Animal;

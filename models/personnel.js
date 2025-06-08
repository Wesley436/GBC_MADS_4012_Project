const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        rank: {
            type: String,
            required: true
        },
        genre: {
            type: [String]
        }
    }
);

const Personnel = mongoose.model('Personnel', schema);

module.exports = {
    Personnel
}
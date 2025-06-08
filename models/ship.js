const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        registry_number: {
            type: String,
            required: true
        }
    }
);

const Ship = mongoose.model('Ship', schema);

module.exports = {
    Ship
}
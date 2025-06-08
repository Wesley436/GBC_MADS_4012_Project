const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        assigned_ship: {
            type: String,
            required: true
        },
        destination_planet: {
            type: String,
            required: true
        },
        mission_purpose: {
            type: String,
            required: true
        }
    }
);

const Mission = mongoose.model('Mission', schema);

module.exports = {
    Mission
}
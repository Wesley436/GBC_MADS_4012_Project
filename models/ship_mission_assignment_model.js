const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.ObjectId;

const schema = new mongoose.Schema(
    {
        ship_id: {
            type: ObjectId,
            required: true
        },
        mission_id: {
            type: ObjectId,
            required: true
        }
    }
);

const ShipMissionAssignment = mongoose.model('ShipMissionAssignment', schema);

module.exports = {
    ShipMissionAssignment
}
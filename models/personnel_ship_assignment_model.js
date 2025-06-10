const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.ObjectId;

const schema = new mongoose.Schema(
    {
        personnel_id: {
            type: ObjectId,
            required: true
        },
        ship_id: {
            type: ObjectId,
            required: true
        }
    }
);

const PersonnelShipAssignment = mongoose.model('PersonnelShipAssignment', schema);

module.exports = {
    PersonnelShipAssignment
}
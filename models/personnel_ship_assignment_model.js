const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        personnel_id: {
            type: String,
            required: true
        },
        ship_id: {
            type: String,
            required: true
        }
    }
);

const PersonnelShipAssignment = mongoose.model('PersonnelShipAssignment', schema);

module.exports = {
    PersonnelShipAssignment
}
const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
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

/** 
 *  Validates whether necessary fields are empty and add errors to an array if not
 *  @param {Object} mission - The mission object to be validated
 *  @param {List<String>} errors - A list storing validation errors (if any)
 */
function validateMission(mission, errors) {
    if(mission.destination_planet === "") {
        errors.push("You must enter a destination planet");
    }

    if(mission.mission_purpose === "") {
        errors.push("You must enter a mission purpose");
    }
}

const Mission = mongoose.model('Mission', schema);

module.exports = {
    Mission,
    validateMission
}
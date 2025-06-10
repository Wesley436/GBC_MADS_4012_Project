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

/** 
 *  Validates whether necessary fields are empty and add errors to an array if not
 *  @param {Object} ship - The ship object to be validated
 *  @param {List<String>} errors - A list storing validation errors (if any)
 */
function validateShip(ship, errors) {
    if(ship.name === "") {
        errors.push("You must enter a name");
    }

    if(ship.registry_number === "") {
        errors.push("You must enter a registry number");
    }
}

const Ship = mongoose.model('Ship', schema);

module.exports = {
    Ship,
    validateShip
}
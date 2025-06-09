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
        skills: {
            type: [String]
        }
    }
);

/** 
 *  Validates whether necessary fields are empty and add errors to an array if not
 *  @param {Object} personnel - The personnel object to be validated
 *  @param {List<String>} errors - A list storing validation errors (if any)
 */
function validatePersonnel(personnel, errors) {
    if(personnel.title === "") {
        errors.push("You must enter a name");
    }

    if(personnel.rank === "") {
        errors.push("You must select a rank");
    }
}

const Personnel = mongoose.model('Personnel', schema);

module.exports = {
    Personnel
}
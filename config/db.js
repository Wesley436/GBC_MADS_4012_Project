const mongoose = require("mongoose");

async function dbInit() {
    await mongoose.connect(process.env.DATABASE_CONNECTION_STRING);
    console.log("You have sucessfully connected to your mongodb database");
}

module.exports = {
    dbInit
}
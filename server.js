const express = require("express");

require("dotenv").config();
const db = require("./config/db.js");
const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine","ejs");

db.dbInit();

app.get("/", async function(req,res) {
    res.render("home.ejs");
});

const PORT = 3001;
    app.listen(PORT, function() {
    console.log(`My Server is up and runniong on port ${PORT} `);
});
const express = require("express");

const personnel = require("./models/personnel_model.js");
const Personnel = personnel.Personnel;
const ship = require("./models/ship_model.js");
const Ship = ship.Ship;
const personnel_ship_assignment = require("./models/personnel_ship_assignment_model.js");
const PersonnelShipAssignment = personnel_ship_assignment.PersonnelShipAssignment;
const ship_mission_assignment = require("./models/ship_mission_assignment_model.js");
const ShipMissionAssignment = ship_mission_assignment.ShipMissionAssignment;
const mission = require("./models/mission_model.js");
const Mission = mission.Mission;

const personnel_controller = require("./controller/personnel_controller.js");
const ship_controller = require("./controller/ship_controller.js");
const mission_controller = require("./controller/mission_controller.js");

require("dotenv").config();
const db = require("./config/db.js");
const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine","ejs");

const session = require("express-session");
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

db.dbInit();

app.get("/", async function(req,res) {
    const personnels = await Personnel.find();
    const ships = await Ship.find();
    const missions = await Mission.find();
    const personnelShipAssignment = await PersonnelShipAssignment.find();
    const shipMissionAssignment = await ShipMissionAssignment.find();

    res.render("home.ejs", {personnels, ships, missions, personnelShipAssignment, shipMissionAssignment});
});

app.use("/personnel", personnel_controller);
app.use("/ship", ship_controller);
app.use("/mission", mission_controller);

const PORT = 3001;
    app.listen(PORT, function() {
    console.log(`My Server is up and runniong on port ${PORT} `);
});
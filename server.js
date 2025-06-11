const express = require("express");
const ObjectId = require('mongoose').Types.ObjectId;
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
// const mission_controller = require("./controller/mission_controller.js");

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

app.get("/mission", async function(req, res) {
    const ships = await Ship.find();
    const missions = await Mission.aggregate()
    .lookup({
        from: 'shipmissionassignments',
        localField: '_id',
        foreignField: 'mission_id',
        as: 'assignments'
    });

    const assigned_ship_ids = [];
    for (let mission of missions) {
        if (mission.assignments[0]) {
            mission.assigned_ship_id = mission.assignments[0]?.ship_id.toString();
            assigned_ship_ids.push(mission.assigned_ship_id);
        }
    }

    res.render("mission.ejs", {missions, ships, assigned_ship_ids, errors: req.session.errors});
    req.session.errors = [];
});

app.get("/create-mission", function(req, res) {
    return res.render("create_mission.ejs", {errors: [], id: null, mission: {}, action_type: "create"});
});

app.post("/mission", async function(req, res) {
    const errors = [];
    const newMission = req.body;
    
    mission.validateMission(newMission, errors);

    if(errors.length > 0) {
        return res.render("create_mission.ejs", {errors, id: null, mission: newMission, action_type: "create"});
    }

    const newMissionModel = new Mission(newMission);
    await newMissionModel.save();

    res.redirect("/mission");
});

app.get("/edit-mission/:id", async function(req, res) {
    const id = req.params.id;

    if (!id || id.length !== 24) {
        res.redirect("/");
        return;
    }

    const currentMission = await Mission.findById(req.params.id);
    if (!currentMission) {
        res.redirect("/create-mission");
    }

    return res.render("create_mission.ejs", {errors: [], id, mission: currentMission, action_type: "edit"});
});

app.post("/mission/:id", async function(req, res) {
    const id = req.params.id;

    if (!id || id.length !== 24) {
        res.redirect("/");
        return;
    }
    
    const errors = [];
    const currentMission = req.body;
    
    mission.validateMission(currentMission, errors);

    if(errors.length > 0) {
        return res.render("create_mission.ejs", {errors, id, mission: currentMission, action_type: "edit"});
    }

    await Mission.findOneAndUpdate(
        {_id: id},
        {
            $set: {
                destination_planet: currentMission.destination_planet,
                mission_purpose: currentMission.mission_purpose
            }
        },
        {new: true, runValidators: true}
    );

    res.redirect("/mission");
});

app.post("/assign-mission-to-ship", async function(req, res) {
    const mission_id = req.body.mission_id;
    const ship_id = req.body.ship_id;
    if (mission_id === null) {
        return;
    }

    await ShipMissionAssignment.findOneAndDelete({mission_id: mission_id});

    if (ship_id === null || !ship_id) {
        res.redirect("/mission");
        return;
    }

    const newModel = new ShipMissionAssignment({mission_id: mission_id, ship_id: ship_id});
    await newModel.save();

    res.redirect("/mission");
});

app.post("/delete-mission/:id", async function(req, res) {
    const id = req.params.id;
    
    if (!id || id.length !== 24) {
        res.redirect("/");
        return;
    }

    const ship_assignments = await ShipMissionAssignment.find({mission_id: new ObjectId(id)});
    
    if (ship_assignments.length === 0) {
        await Mission.findOneAndDelete({_id: id});
    } else {
        req.session.errors = ['Please unassign ship from mission'];
    }
    res.redirect("/mission");
});

app.use("/personnel", personnel_controller);
app.use("/ship", ship_controller);
// app.use("/mission", mission_controller);

const PORT = 3001;
    app.listen(PORT, function() {
    console.log(`My Server is up and runniong on port ${PORT} `);
});
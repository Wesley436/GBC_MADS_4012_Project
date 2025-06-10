const express = require("express");
const personnel = require("./models/personnel_model.js");
const Personnel = personnel.Personnel;
const ship = require("./models/ship_model.js");
const Ship = ship.Ship;
const personnel_ship_assignment = require("./models/personnel_ship_assignment_model.js");
const PersonnelShipAssignment = personnel_ship_assignment.PersonnelShipAssignment;
const mission = require("./models/mission_model.js");
const Mission = mission.Mission;

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

app.get("/personnel", async function(req, res) {
    const personnels = await Personnel.find();
    const ships = await Ship.find();
    res.render("personnel.ejs", {personnels: personnels, ships: ships});
});

app.get("/create-personnel", function(req, res) {
    return res.render("create_personnel.ejs", {errors: [], id: null, personnel: {}, action_type: "create"});
});

app.post("/personnel", async function(req, res) {
    const errors = [];
    const newPersonnel = req.body;
    
    personnel.validatePersonnel(newPersonnel, errors);

    if(errors.length > 0) {
        return res.render("create_personnel.ejs", {errors, id: null, personnel: newPersonnel, action_type: "create"});
    }

    const newPersonnelModel = new Personnel(newPersonnel);
    await newPersonnelModel.save();

    res.redirect("/personnel");
});

app.get("/edit-personnel/:id", async function(req, res) {
    const id = req.params.id;

    if (!id || id.length !== 24) {
        res.redirect("/");
        return;
    }

    const currentPersonnel = await Personnel.findById(req.params.id);
    if (!currentPersonnel) {
        res.redirect("/create-personnel");
    }

    return res.render("create_personnel.ejs", {errors: [], id: id, personnel: currentPersonnel, action_type: "edit"});
});

app.post("/personnel/:id", async function(req, res) {
    const id = req.params.id;

    if (!id || id.length !== 24) {
        res.redirect("/");
        return;
    }
    
    const errors = [];
    const currentPersonnel = req.body;
    
    personnel.validatePersonnel(currentPersonnel, errors);

    if(errors.length > 0) {
        return res.render("create_personnel.ejs", {errors, id: id, personnel: currentPersonnel, action_type: "edit"});
    }

    await Personnel.findOneAndUpdate(
        {_id: id},
        {
            $set: {
                name: currentPersonnel.name,
                rank: currentPersonnel.rank,
                skills: currentPersonnel.skills
            }
        },
        {new: true, runValidators: true}
    );

    res.redirect("/personnel");
});

app.post("/delete-personnel/:id", async function(req, res) {
    const id = req.params.id;
    
    if (!id || id.length !== 24) {
        res.redirect("/");
        return;
    }

    await Personnel.findOneAndDelete({_id: id});

    res.redirect("/personnel");
});

app.post("/assign-personnel-to-ship", async function(req, res) {
    const personnel_id = req.body.personnel_id;
    const ship_id = req.body.ship_id;
    if (personnel_id === null) {
        return;
    }

    await PersonnelShipAssignment.findOneAndDelete({personnel_id: personnel_id});

    if (ship_id === null || !ship_id) {
        res.redirect("/personnel");
        return;
    }

    const newModel = new PersonnelShipAssignment({personnel_id: personnel_id, ship_id: ship_id});
    await newModel.save();

    res.redirect("/personnel");
});

app.get("/ship", async function(req, res) {
    const ships = await Ship.find();
    res.render("ship.ejs", {ships: ships});
});

app.get("/create-ship", function(req, res) {
    return res.render("create_ship.ejs", {errors: [], id: null, ship: {}, action_type: "create"});
});

app.post("/ship", async function(req, res) {
    const errors = [];
    const newShip = req.body;
    
    ship.validateShip(newShip, errors);

    if(errors.length > 0) {
        return res.render("create_ship.ejs", {errors, id: null, ship: newShip, action_type: "create"});
    }

    const newShipModel = new Ship(newShip);
    await newShipModel.save();

    res.redirect("/ship");
});

app.get("/edit-ship/:id", async function(req, res) {
    const id = req.params.id;

    if (!id || id.length !== 24) {
        res.redirect("/");
        return;
    }

    const currentShip = await Ship.findById(req.params.id);
    if (!currentShip) {
        res.redirect("/create-ship");
    }

    return res.render("create_ship.ejs", {errors: [], id: id, ship: currentShip, action_type: "edit"});
});

app.post("/ship/:id", async function(req, res) {
    const id = req.params.id;

    if (!id || id.length !== 24) {
        res.redirect("/");
        return;
    }
    
    const errors = [];
    const currentShip = req.body;
    
    ship.validateShip(currentShip, errors);

    if(errors.length > 0) {
        return res.render("create_ship.ejs", {errors, id: id, ship: currentShip, action_type: "edit"});
    }

    await Ship.findOneAndUpdate(
        {_id: id},
        {
            $set: {
                name: currentShip.name,
                registry_number: currentShip.registry_number
            }
        },
        {new: true, runValidators: true}
    );

    res.redirect("/ship");
});

app.post("/delete-ship/:id", async function(req, res) {
    const id = req.params.id;
    
    if (!id || id.length !== 24) {
        res.redirect("/");
        return;
    }

    await Ship.findOneAndDelete({_id: id});

    res.redirect("/ship");
});

app.get("/mission", async function(req, res) {
    const missions = await Mission.find();
    res.render("mission.ejs", {missions: missions});
});

app.post("/mission", async function(req, res) {
    
});

app.put("/mission/:id", async function(req, res) {
    
});

app.delete("/mission/:id", async function(req, res) {
    
});

const PORT = 3001;
    app.listen(PORT, function() {
    console.log(`My Server is up and runniong on port ${PORT} `);
});
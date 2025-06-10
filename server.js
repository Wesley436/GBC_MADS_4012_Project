const express = require("express");
const personnel = require("./models/personnel.js");
const Personnel = personnel.Personnel;
const ship = require("./models/ship.js");
const Ship = ship.Ship;
const mission = require("./models/mission.js");
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
    res.render("personnel.ejs", {personnels: personnels});
});

app.get("/create-personnel", function(req, res) {
    return res.render("create_personnel.ejs", {errors: [], id: null, personnel: {}, action_type: "create"});
});

app.post("/personnel", async function(req, res) {
    const errors = [];
    newPersonnel = req.body;
    
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
    currentPersonnel = req.body;
    
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

app.get("/ship", async function(req, res) {
    const ships = await Ship.find();
    res.render("ship.ejs", {ships: ships});
});

app.post("/ship", async function(req, res) {
    
});

app.put("/ship/:id", async function(req, res) {
    
});

app.delete("/ship/:id", async function(req, res) {
    
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
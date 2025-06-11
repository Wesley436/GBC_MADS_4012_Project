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

// app.get("/personnel", async function(req, res) {
//     const ships = await Ship.find();
//     const personnels = await Personnel.aggregate()
//     .lookup({
//         from: 'personnelshipassignments',
//         localField: '_id',
//         foreignField: 'personnel_id',
//         as: 'assignments'
//     });

//     for (let personnel of personnels) {
//         personnel.assigned_ship_id = personnel.assignments[0]?.ship_id.toString();
//     }

//     res.render("personnel.ejs", {personnels, ships, errors: req.session.errors});
//     req.session.errors = [];
// });

// app.get("/create-personnel", function(req, res) {
//     return res.render("create_personnel.ejs", {errors: [], id: null, personnel: {}, action_type: "create"});
// });

// app.post("/personnel", async function(req, res) {
//     const errors = [];
//     const newPersonnel = req.body;
    
//     personnel.validatePersonnel(newPersonnel, errors);

//     if(errors.length > 0) {
//         return res.render("create_personnel.ejs", {errors, id: null, personnel: newPersonnel, action_type: "create"});
//     }

//     const newPersonnelModel = new Personnel(newPersonnel);
//     await newPersonnelModel.save();

//     res.redirect("/personnel");
// });

// app.get("/edit-personnel/:id", async function(req, res) {
//     const id = req.params.id;

//     if (!id || id.length !== 24) {
//         res.redirect("/");
//         return;
//     }

//     const currentPersonnel = await Personnel.findById(req.params.id);
//     if (!currentPersonnel) {
//         res.redirect("/create-personnel");
//     }

//     return res.render("create_personnel.ejs", {errors: [], id, personnel: currentPersonnel, action_type: "edit"});
// });

// app.post("/personnel/:id", async function(req, res) {
//     const id = req.params.id;

//     if (!id || id.length !== 24) {
//         res.redirect("/");
//         return;
//     }
    
//     const errors = [];
//     const currentPersonnel = req.body;
    
//     personnel.validatePersonnel(currentPersonnel, errors);

//     if(errors.length > 0) {
//         return res.render("create_personnel.ejs", {errors, id, personnel: currentPersonnel, action_type: "edit"});
//     }

//     await Personnel.findOneAndUpdate(
//         {_id: id},
//         {
//             $set: {
//                 name: currentPersonnel.name,
//                 rank: currentPersonnel.rank,
//                 skills: currentPersonnel.skills
//             }
//         },
//         {new: true, runValidators: true}
//     );

//     res.redirect("/personnel");
// });

// app.post("/delete-personnel/:id", async function(req, res) {
//     const id = req.params.id;
    
//     if (!id || id.length !== 24) {
//         res.redirect("/");
//         return;
//     }

//     const assignments = await PersonnelShipAssignment.find({personnel_id: new ObjectId(id)});

//     if (assignments.length === 0) {
//         await Personnel.findOneAndDelete({_id: id});
//     } else {
//         req.session.errors = ['Please unassign personnel from ship'];
//     }
//     res.redirect("/personnel");
// });

// app.post("/assign-personnel-to-ship", async function(req, res) {
//     const personnel_id = req.body.personnel_id;
//     const ship_id = req.body.ship_id;
//     if (personnel_id === null) {
//         return;
//     }

//     await PersonnelShipAssignment.findOneAndDelete({personnel_id: personnel_id});

//     if (ship_id === null || !ship_id) {
//         res.redirect("/personnel");
//         return;
//     }

//     const newModel = new PersonnelShipAssignment({personnel_id: personnel_id, ship_id: ship_id});
//     await newModel.save();

//     res.redirect("/personnel");
// });

app.get("/ship", async function(req, res) {
    const missions = await Mission.find();
    const ships = await Ship.aggregate()
    .lookup({
        from: 'shipmissionassignments',
        localField: '_id',
        foreignField: 'ship_id',
        as: 'assignments'
    })
    .addFields({
        assigned_mission_id: { $arrayElemAt: ["$assignments.mission_id", 0] }
    });

    for (let ship of ships) {
        if (ship.assignments[0]) {
            for (let mission of missions) {
                if (mission._id.toString() === ship.assignments[0]?.mission_id.toString()) {
                    ship.destination_planet = mission.destination_planet;
                }
            }
        }
    }

    res.render("ship.ejs", {ships, missions, errors: req.session.errors});

    req.session.errors = [];
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

    return res.render("create_ship.ejs", {errors: [], id, ship: currentShip, action_type: "edit"});
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
        return res.render("create_ship.ejs", {errors, id, ship: currentShip, action_type: "edit"});
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

    const personnel_assignments = await PersonnelShipAssignment.find({ship_id: new ObjectId(id)});
    const mission_assignments = await ShipMissionAssignment.find({ship_id: new ObjectId(id)});
    
    if (personnel_assignments.length === 0 && mission_assignments.length === 0) {
        await Ship.findOneAndDelete({_id: id});
    } else {
        req.session.errors = ['Please unassign personnels and missions from ship'];
    }
    res.redirect("/ship");
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

const PORT = 3001;
    app.listen(PORT, function() {
    console.log(`My Server is up and runniong on port ${PORT} `);
});
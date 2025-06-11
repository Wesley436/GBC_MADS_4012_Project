const express = require('express');

const ObjectId = require('mongoose').Types.ObjectId;
const ship = require("../models/ship_model.js");
const Ship = ship.Ship;
const personnel_ship_assignment = require("../models/personnel_ship_assignment_model.js");
const PersonnelShipAssignment = personnel_ship_assignment.PersonnelShipAssignment;
const ship_mission_assignment = require("../models/ship_mission_assignment_model.js");
const ShipMissionAssignment = ship_mission_assignment.ShipMissionAssignment;
const mission = require("../models/mission_model.js");
const Mission = mission.Mission;

const router = express.Router();

router.get("/", async function(req, res) {
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

router.get("/create", function(req, res) {
  return res.render("create_ship.ejs", {errors: [], id: null, ship: {}, action_type: "create"});
});

router.post("/", async function(req, res) {
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

router.get("/edit/:id", async function(req, res) {
  const id = req.params.id;
  
  if (!id || id.length !== 24) {
      res.redirect("/");
      return;
  }

  const currentShip = await Ship.findById(req.params.id);
  if (!currentShip) {
      res.redirect("/ship/create");
  }

  return res.render("create_ship.ejs", {errors: [], id, ship: currentShip, action_type: "edit"});
});

router.post("/delete/:id", async function(req, res) {
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

router.post("/:id", async function(req, res) {
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

module.exports = router;
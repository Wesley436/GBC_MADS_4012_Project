const express = require("express");

const ObjectId = require('mongoose').Types.ObjectId;
const ship = require("../models/ship_model.js");
const Ship = ship.Ship;
const ship_mission_assignment = require("../models/ship_mission_assignment_model.js");
const ShipMissionAssignment = ship_mission_assignment.ShipMissionAssignment;
const mission = require("../models/mission_model.js");
const Mission = mission.Mission;

const router = express.Router();

router.get("/", async function(req, res) {
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

router.get("/create", function(req, res) {
  return res.render("create_mission.ejs", {errors: [], id: null, mission: {}, action_type: "create"});
});

router.post("/", async function(req, res) {
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

router.post("/assign-mission-to-ship", async function(req, res) {
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

router.get("/edit/:id", async function(req, res) {
  const id = req.params.id;
  
  if (!id || id.length !== 24) {
      res.redirect("/");
      return;
  }

  const currentMission = await Mission.findById(req.params.id);
  if (!currentMission) {
      res.redirect("/mission/create");
  }

  return res.render("create_mission.ejs", {errors: [], id, mission: currentMission, action_type: "edit"});
});

router.post("/delete/:id", async function(req, res) {
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

router.post("/:id", async function(req, res) {
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

module.exports = router;
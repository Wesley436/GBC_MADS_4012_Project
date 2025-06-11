const express = require('express');

const ObjectId = require('mongoose').Types.ObjectId;
const personnel = require("../models/personnel_model.js");
const Personnel = personnel.Personnel;
const ship = require("../models/ship_model.js");
const Ship = ship.Ship;
const personnel_ship_assignment = require("../models/personnel_ship_assignment_model.js");
const PersonnelShipAssignment = personnel_ship_assignment.PersonnelShipAssignment;
const router = express.Router();

router.get("/", async function(req, res) {
  const ships = await Ship.find();
  const personnels = await Personnel.aggregate()
  .lookup({
      from: 'personnelshipassignments',
      localField: '_id',
      foreignField: 'personnel_id',
      as: 'assignments'
  });

  for (let personnel of personnels) {
      personnel.assigned_ship_id = personnel.assignments[0]?.ship_id.toString();
  }

  res.render("personnel.ejs", {personnels, ships, errors: req.session.errors});
  req.session.errors = [];
});

router.get("/create", function(req, res) {
  return res.render("create_personnel.ejs", {errors: [], id: null, personnel: {}, action_type: "create"});
});

router.post("/", async function(req, res) {
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

router.post("/assign-personnel-to-ship", async function(req, res) {
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

router.get("/edit/:id", async function(req, res) {
  const id = req.params.id;

  if (!id || id.length !== 24) {
      res.redirect("/");
      return;
  }

  const currentPersonnel = await Personnel.findById(req.params.id);
  if (!currentPersonnel) {
      res.redirect("/personnel/create");
  }

  return res.render("create_personnel.ejs", {errors: [], id, personnel: currentPersonnel, action_type: "edit"});
});

router.post("/delete/:id", async function(req, res) {
  const id = req.params.id;
  
  if (!id || id.length !== 24) {
      res.redirect("/");
      return;
  }

  const assignments = await PersonnelShipAssignment.find({personnel_id: new ObjectId(id)});

  if (assignments.length === 0) {
      await Personnel.findOneAndDelete({_id: id});
  } else {
      req.session.errors = ['Please unassign personnel from ship'];
  }
  res.redirect("/personnel");
});

router.post("/:id", async function(req, res) {
  const id = req.params.id;

  if (!id || id.length !== 24) {
      res.redirect("/");
      return;
  }
  
  const errors = [];
  const currentPersonnel = req.body;
  
  personnel.validatePersonnel(currentPersonnel, errors);

  if(errors.length > 0) {
      return res.render("create_personnel.ejs", {errors, id, personnel: currentPersonnel, action_type: "edit"});
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

module.exports = router;

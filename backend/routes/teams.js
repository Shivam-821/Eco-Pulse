const router = require("express").Router();
const Team = require("../models/Team");
const auth = require("../middleware/auth");

router.get("/", auth(["admin"]), async (req, res) => {
  const teams = await Team.find();
  res.json(teams);
});

router.post("/", auth(["admin"]), async (req, res) => {
  const team = new Team({ ...req.body, date: new Date() });
  await team.save();
  res.status(201).json(team);
});

module.exports = router;

const router = require("express").Router();
const Task = require("../models/Task");
const auth = require("../middleware/auth");

router.get("/locations", auth(), async (req, res) => {
  const tasks = await Task.find();
  const markers = tasks.map(t => ({
    name: t.description,
    lat: 0,
    lon: 0,
    status: t.completed ? "COMPLETED" : "PENDING",
    teamAssigned: !!t.team,
    time: t.timestamp,
  }));
  res.json(markers);
});

module.exports = router;

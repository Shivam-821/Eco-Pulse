const router = require("express").Router();
const Task = require("../models/Task");
const Team = require("../models/Team");
const Report = require("../models/Report");
const auth = require("../middleware/auth");

router.get("/", auth(["admin"]), async (req, res) => {
  const totalTasks = await Task.countDocuments();
  const completedTasks = await Task.countDocuments({ completed: true });
  const activeTeams = await Team.countDocuments({ status: "ASSIGNED" });
  const pendingReports = await Report.countDocuments();
  res.json({ totalTasks, completedTasks, activeTeams, pendingReports });
});

module.exports = router;

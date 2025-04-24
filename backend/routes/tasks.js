const router = require("express").Router();
const Task = require("../models/Task");
const auth = require("../middleware/auth");

router.get("/", auth(), async (req, res) => {
  const tasks = await Task.find().populate("team");
  res.json(tasks);
});

router.post("/assign", auth(["admin"]), async (req, res) => {
  const { taskId, teamId, deadline } = req.body;
  const task = await Task.findByIdAndUpdate(taskId, {
    team: teamId,
    assigned: true,
    deadline,
  }, { new: true });
  res.json(task);
});

router.put("/:id/complete", auth(), async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, { completed: true }, { new: true });
  res.json(task);
});

module.exports = router;

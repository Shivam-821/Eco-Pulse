import { Router } from "express";
import { Task } from "../models/index.js";
import { verifyUser, verifyAdmin } from "../middleware/auth.middleware.js";

const router = Router();

// Get all tasks (populating the assigned team)
router.get("/", verifyUser, async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo");
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Assign a task to a team (admin only)
router.post("/assign", verifyAdmin, async (req, res) => {
  try {
    const { taskId, teamId, deadline } = req.body;
    const task = await Task.findByIdAndUpdate(
      taskId,
      {
        assignedTo: teamId,
        assigned: true,
        deadline,
      },
      { new: true }
    );
    res.json(task);
  } catch (error) {
    console.error("Error assigning task:", error);
    res.status(500).json({ error: "Failed to assign task" });
  }
});

// Mark a task as complete
router.put("/:id/complete", verifyUser, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { completed: true },
      { new: true }
    );
    res.json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
});

export default router;
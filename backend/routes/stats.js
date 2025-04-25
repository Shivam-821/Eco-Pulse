import express from "express";
import { Task, AssignTeam, Regdump } from "../models/index.js";
import { verifyAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", verifyAdmin, async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ completed: true });
    // Since the team model is now AssignTeam without a "status" field, count all teams.
    const activeTeams = await AssignTeam.countDocuments();
    const pendingReports = await Regdump.countDocuments();
    res.json({ totalTasks, completedTasks, activeTeams, pendingReports });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

export default router;
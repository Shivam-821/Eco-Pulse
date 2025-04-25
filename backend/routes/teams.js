import { Router } from "express";
import { AssignTeam } from "../models/index.js";
import { verifyAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", verifyAdmin, async (req, res) => {
  try {
    const teams = await AssignTeam.find();
    res.json(teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    res.status(500).json({ error: "Failed to fetch teams" });
  }
});

router.post("/", verifyAdmin, async (req, res) => {
  try {
    
    const team = new AssignTeam({ ...req.body});
    await team.save();
    res.status(201).json(team);
  } catch (error) {
    console.error("Error creating team:", error);
    res.status(500).json({ error: "Failed to create team" });
  }
});

export default router;
import { Router } from "express";
import { Task } from "../models/index.js";
import { verifyUser } from "../middleware/index.js";

const router = Router();

router.get("/locations", verifyUser, async (req, res) => {
  try {
    const tasks = await Task.find();
    const markers = tasks.map((t) => {
      const [lon = 0, lat = 0] = t.location?.coordinates || [];
      return {
        name: t.description,
        lat,
        lon,
        status: t.completed ? "COMPLETED" : "PENDING",
        teamAssigned: !!t.assignedTo,
        time: t.createdAt, // using createdAt timestamp from timestamps option
      };
    });
    res.json(markers);
  } catch (error) {
    console.error("Error fetching task locations:", error);
    res.status(500).json({ error: "Failed to fetch markers" });
  }
});

export default router;
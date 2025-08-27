import { Router } from "express";
import { Task } from "../models/index.js";
import { verifyUser, verifyAdmin, verifyTeam } from "../middleware/auth.middleware.js";
import { assignTask, getAllTeam, workCompleted } from "../controllers/assignTeam.controller.js";

const router = Router();

// route to assign task
router.route('/assign-task').post(verifyAdmin, assignTask)

// Mark a task as complete
router.route('/:dumpId/completed').put(verifyTeam, workCompleted)

// Get all teams
router.route("/get-all-assignteam").get(getAllTeam)

export default router;
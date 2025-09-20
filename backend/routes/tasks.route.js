import { Router } from "express";
import { verifyAdmin, verifyTeam } from "../middleware/auth.middleware.js";
import { assignTask, getAllTeam, workCompleted } from "../controllers/assignTeam.controller.js";
import upload from "../middleware/multer.middleware.js";

const router = Router();

// route to assign task
router.route('/assign-task').post(verifyAdmin, assignTask)

// Mark a task as complete
router.route('/completed/:dumpId').post(verifyTeam, upload.single("picture"), workCompleted)

// Get all teams
router.route("/get-all-assignteam").get(getAllTeam)

export default router;
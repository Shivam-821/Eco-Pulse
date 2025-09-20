import { Router } from "express";
import { verifyTeam } from "../middleware/auth.middleware.js";
import { assignedTasks } from "../controllers/assignedTask.controller.js";

const router = Router()

router.route("/task-assigned").get(verifyTeam, assignedTasks);



export default router;
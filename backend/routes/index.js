import express from "express";
const router = express.Router();

// Import individual route files using ES module syntax
import authRoutes from "./auth.route.js";
import teamRoutes from "./teams.js";
import taskRoutes from "./tasks.route.js";
import reportRoutes from "./reports.js";
import notificationRoutes from "./notifications.js";
import mapRoutes from "./map.js";
import uploadRoutes from "./upload.js";
import complainRoutes from './complain.routes.js'
import dumpRoutes from './dumps.routes.js'
import recycleRoutes from './recycle.routes.js'
import statsRoutes from './stats.route.js'
import assignedTaskRoutes from './assignedTask.route.js'

// Mount routes under their respective paths
router.use("/auth", authRoutes);
router.use("/teams", teamRoutes);
router.use("/tasks", taskRoutes);
router.use("/report-dump", reportRoutes);
router.use("/dump-reports", reportRoutes); // if dump reports and report-dump are handled by same controller
router.use("/notifications", notificationRoutes);
router.use("/map", mapRoutes);
router.use("/upload", uploadRoutes);
router.use("/complain", complainRoutes)
router.use("/dump", dumpRoutes)
router.use("/recycle", recycleRoutes)
router.use("/stats", statsRoutes)
router.use("/task-data", assignedTaskRoutes)

export default router;
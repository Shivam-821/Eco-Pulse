import express from "express";
const router = express.Router();

// Import individual route files using ES module syntax
import authRoutes from "./auth.route.js";
import teamRoutes from "./teams.js";
import taskRoutes from "./tasks.js";
import reportRoutes from "./reports.js";
import notificationRoutes from "./notifications.js";
import mapRoutes from "./map.js";
import uploadRoutes from "./upload.js";
import statsRoutes from "./stats.js";

// Mount routes under their respective paths
router.use("/auth", authRoutes);
router.use("/teams", teamRoutes);
router.use("/tasks", taskRoutes);
router.use("/report-dump", reportRoutes);
router.use("/dump-reports", reportRoutes); // if dump reports and report-dump are handled by same controller
router.use("/notifications", notificationRoutes);
router.use("/map", mapRoutes);
router.use("/upload", uploadRoutes);
router.use("/stats", statsRoutes);

export default router;
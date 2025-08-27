import express from "express";

const router = express.Router();

import { Notification } from "../models/index.js";
import { verifyUser, verifyAdmin } from "../middleware/index.js";

// Use verifyUser for any authenticated user
router.get("/", verifyUser, async (req, res) => {
  const notifications = await Notification.find();
  res.json(notifications);
});

// Use verifyAdmin for admin-only access
router.post("/", verifyAdmin, async (req, res) => {
  const notification = new Notification({ ...req.body, timestamp: new Date() });
  await notification.save();
  res.status(201).json(notification);
});

export default router;

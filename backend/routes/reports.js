import express from "express";
import { Regdump } from "../models/index.js";
import { verifyAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", async (req, res) => {
  // Option 1: Rely on timestamps – remove timeReported, or
  // Option 2: Ensure Regdump schema supports timeReported.

  
  const report = new Regdump({ ...req.body, timeReported: new Date() });
  await report.save();
  res.json({ success: true, message: "Report submitted" });
});

router.get("/", verifyAdmin, async (req, res) => {
  const reports = await Regdump.find();
  res.json(reports);
});

export default router;
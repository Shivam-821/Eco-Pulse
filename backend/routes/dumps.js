import express from "express";
import uploadMiddleware, { processImage } from "../middleware/upload.js"; // ensure upload.js exports default uploadMiddleware and processImage
import { Regdump } from "../models/index.js";

const router = express.Router();

router.post("/report-dump", uploadMiddleware, processImage, async (req, res) => {
  try {
    const newDump = new Regdump({
      location: req.body.location,
      description: req.body.description,
      picture: req.file.path, // using 'picture' as in Regdump schema
    });
    await newDump.save();
    res.status(201).json({ message: "Reported successfully", dump: newDump });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to report dump" });
  }
});

export default router;
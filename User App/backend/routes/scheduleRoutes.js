const express = require("express");
const router = express.Router();
const Schedule = require("../models/Times");
const cors = require("cors"); // Add CORS support

// CORS middleware
router.use(cors()); 

// POST /api/schedule
router.post("/", async (req, res) => {
  try {
    // Get location and convert to lowercase for case-insensitive matching
    const location = req.body.location.toLowerCase();
    console.log(`Received location: ${location}`);  // Log location for debugging

    // Find schedule based on location
    const schedule = await Schedule.findOne({ location });

    if (!schedule) {
      return res.status(404).json({ success: false, message: "No schedule found." });
    }

    // Send schedule data in a clean format
    res.json({ success: true, schedule: Object.fromEntries(schedule.days) });
  } catch (error) {
    console.error("Error fetching schedule:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;

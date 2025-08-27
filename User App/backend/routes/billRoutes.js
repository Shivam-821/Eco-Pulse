const express = require("express");
const router = express.Router();
const Bill = require("../models/Bill");

// POST /api/bill
router.post("/", async (req, res) => {
  try {
    const { billNumber } = req.body;
    const bill = await Bill.findOne({ billNumber });

    if (!bill) {
      return res.status(404).json({ success: false, message: "Invalid bill number." });
    }

    res.json({ success: true, bill });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;

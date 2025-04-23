const router = require("express").Router();
const Report = require("../models/Report");
const auth = require("../middleware/auth");

router.post("/", async (req, res) => {
  const report = new Report({ ...req.body, timeReported: new Date() });
  await report.save();
  res.json({ success: true, message: "Report submitted" });
});

router.get("/", auth(["admin"]), async (req, res) => {
  const reports = await Report.find();
  res.json(reports);
});

module.exports = router;

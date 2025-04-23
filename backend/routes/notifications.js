const router = require("express").Router();
const Notification = require("../models/Notification");
const auth = require("../middleware/auth");

router.get("/", auth(), async (req, res) => {
  const notifications = await Notification.find();
  res.json(notifications);
});

router.post("/", auth(["admin"]), async (req, res) => {
  const notification = new Notification({ ...req.body, timestamp: new Date() });
  await notification.save();
  res.status(201).json(notification);
});

module.exports = router;

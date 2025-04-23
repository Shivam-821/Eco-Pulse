const mongoose = require("mongoose");

module.exports = mongoose.model("Notification", new mongoose.Schema({
  message: String,
  timestamp: Date,
  type: String,
}));

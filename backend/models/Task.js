const mongoose = require("mongoose");

module.exports = mongoose.model("Task", new mongoose.Schema({
  location: String,
  type: String,
  color: String,
  timestamp: Date,
  assigned: Boolean,
  completed: Boolean,
  team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
  deadline: Date,
  description: String,
}));

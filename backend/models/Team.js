const mongoose = require("mongoose");

module.exports = mongoose.model("Team", new mongoose.Schema({
  name: String,
  phone: String,
  location: String,
  status: { type: String, enum: ["ASSIGNED", "NOT ASSIGNED"], default: "NOT ASSIGNED" },
  date: Date,
}));

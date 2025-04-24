const mongoose = require("mongoose");

module.exports = mongoose.model("Report", new mongoose.Schema({
  name: String,
  location: String,
  description: String,
  contactInfo: String,
  timeReported: Date,
}));

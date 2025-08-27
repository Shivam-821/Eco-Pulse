const mongoose = require("mongoose");

const timeSchema = new mongoose.Schema({
  location: { type: String, required: true, lowercase: true },  // Ensure all location data is lowercase
  days: { type: Map, of: String },  // { Monday: "7 AM", Thursday: "8 AM" }
});

module.exports = mongoose.model("Times", timeSchema);

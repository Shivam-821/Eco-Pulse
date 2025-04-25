const mongoose = require('mongoose');

const pickupRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  contactNumber: { type: String, required: true },
  wasteType: { type: String, required: true },
  pickupDate: { type: String, required: true }, // stored as YYYY-MM-DD string
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PickupRequest', pickupRequestSchema);

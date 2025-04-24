const mongoose = require('mongoose');

const dumpSchema = new mongoose.Schema({
  location: String,
  description: String,
  image: String, // path to the uploaded image
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Dump', dumpSchema);

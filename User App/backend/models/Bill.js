const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  billNumber: { type: String, required: true, unique: true },
  amount: Number,
  status: { type: String, enum: ["unpaid", "paid"], default: "unpaid" },
});

module.exports = mongoose.model("Bill", billSchema);

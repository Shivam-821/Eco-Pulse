import mongoose, { Schema } from "mongoose";

const smartBinSchema = new Schema({
  uniqueCode: {
    type: String,
    required: true,
  },
  pincode: {
    type: Number,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true, // [longitude, latitude]
    },
  },
  district: {
    type: String,
  },
  state: {
    type: String,
  },
  fillLevel: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["green", "orange", "red"],
    required: true,
  },
  assignedTeam: {
    type: Schema.Types.ObjectId,
    ref: "AssignTeam",
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});


smartBinSchema.index({ pincode: 1, uniqueCode: 1 }, { unique: true });


smartBinSchema.index({ location: "2dsphere" });

export const SmartBin = mongoose.model("SmartBin", smartBinSchema);
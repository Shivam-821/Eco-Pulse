import mongoose, { Schema } from "mongoose";

const generalComplaintSchema = new Schema(
  {
    complaintType: {
      type: String,
      enum: ["bin-issue", "dump-inaction"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    relatedDump: {
      type: Schema.Types.ObjectId,
      ref: "Regdump",
      required: function () {
        return this.complaintType === "dump-inaction";
      },
    },
    binUniqueCode: {
      type: String,
      required: function () {
        return this.complaintType === "bin-issue";
      },
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], 
        required: true,
      },
    },
    address:{
      type: String,
    },
    pincode: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTeam: {
      type: Schema.Types.ObjectId,
      ref: "AssignTeam"
    },
    resolved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);


generalComplaintSchema.index({ location: "2dsphere" });

export const GeneralComplaint = mongoose.model(
  "GeneralComplaint",
  generalComplaintSchema
);
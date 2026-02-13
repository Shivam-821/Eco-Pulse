import mongoose, { Schema } from "mongoose";

const registerdumpSchema = new Schema(
  {
    address: {
      type: String,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
      },
    },
    district: {
      type: String,
    },
    state: {
      type: String,
    },
    picture: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    dumpReporter: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    teamAssigned: {
      type: Boolean,
      default: false,
    },
    assignedTeam: {
      type: Schema.Types.ObjectId,
      ref: "AssignTeam",
    },
    completed: {
      type: Boolean,
      default: false,
    },
    complainLodge: {
      type: Boolean,
      default: false,
    },
    completedPicture: {
      type: String, // Stores the 'After' photo
    },
    uniqueNumber: {
      type: Number,
      required: true,
    },
    aiAnalysis: {
      type: Object, // Stores AI analysis results (wasteType, severity, summary, etc.)
    },
  },
  { timestamps: true },
);

export const Regdump = mongoose.model("Regdump", registerdumpSchema);

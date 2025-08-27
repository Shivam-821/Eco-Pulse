import mongoose,{Schema} from "mongoose";

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
      ref: "AssignTeam"
    },
    completed: {
      type: Boolean,
      default: false,
    },
    complainLodge: {
      type: Boolean,
      default: false,
    },
    uniqueNumber: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);


export const Regdump = mongoose.model("Regdump", registerdumpSchema)
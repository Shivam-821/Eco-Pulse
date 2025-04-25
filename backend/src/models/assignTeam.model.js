import mongoose,{Schema} from "mongoose";

const assignTeamSchema = new Schema({
  teamname: {
    type: String,
    required: true,
    unique: true,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  assignedWork: [
    {
      type: Schema.Types.ObjectId,
      ref: "Regdump",
    },
  ],
});

assignTeamSchema.index({ location: "2dsphere" });

export const AssignTeam = mongoose.model('AssignTeam', assignTeamSchema)

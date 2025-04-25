import mongoose, { Schema } from "mongoose";

const maintenanceSchema = new Schema({
    binId: {
        type: Schema.Types.ObjectId,
        ref: "Bin",
        required: true
    },
    type: {
        type: String,
        enum: ["ROUTINE", "REPAIR", "EMERGENCY"],
        required: true
    },
    description: String,
    assignedTeam: {
        type: Schema.Types.ObjectId,
        ref: "AssignTeam"
    },
    status: {
        type: String,
        enum: ["PENDING", "IN_PROGRESS", "COMPLETED"],
        default: "PENDING"
    },
    scheduledDate: Date,
    completedDate: Date,
    notes: String
}, {
    timestamps: true
});

export const Maintenance = mongoose.model("Maintenance", maintenanceSchema);
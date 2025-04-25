import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["ALERT", "INFO", "WARNING"],
        default: "INFO"
    },
    recipient: {
        type: Schema.Types.ObjectId,
        refPath: "recipientModel"
    },
    recipientModel: {
        type: String,
        enum: ["User", "Admin", "AssignTeam"]
    },
    read: {
        type: Boolean,
        default: false
    },
    priority: {
        type: String,
        enum: ["LOW", "MEDIUM", "HIGH"],
        default: "LOW"
    }
}, {
    timestamps: true
});

export const Notification = mongoose.model("Notification", notificationSchema);
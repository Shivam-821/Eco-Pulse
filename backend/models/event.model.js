import mongoose, { Schema } from "mongoose";

const eventSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    date: {
        type: Date,
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number],
            required: true
        },
        address: String
    },
    organizer: {
        type: Schema.Types.ObjectId,
        ref: "Admin",
        required: true
    },
    participants: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    status: {
        type: String,
        enum: ["SCHEDULED", "ONGOING", "COMPLETED", "CANCELLED"],
        default: "SCHEDULED"
    }
}, {
    timestamps: true
});

export const Event = mongoose.model("Event", eventSchema);
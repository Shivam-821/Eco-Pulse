import mongoose, {Schema} from 'mongoose'


const recycleSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    recycableItems: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    image: {
        type: String,
    },
    quantity:{
        type: Number,
        required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Collected", "Rejected"],
      default: "Pending",
    },
    address: {
      type: String,
      required: true,
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
  },
  { timestamps: true }
);


export const Recycle = mongoose.model("Recycle", recycleSchema)
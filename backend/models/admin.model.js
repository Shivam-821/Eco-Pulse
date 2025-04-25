import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const adminSchema = new Schema({
  fullname: {
    type: String,
    required: true,
  },
  pincode: {
    type: Number,
    required: true,
  },
  district: {
    type: String,
    required: true,
    unique: true,
  },
  state: {
    type: String,
    required: true,
  },
  adminOfficer: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
      },
    },
  },
  helpLineNumber: {
    type: Number,
  },
  password: {
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
  complaintReceived: [
    {
      type: Schema.Types.ObjectId,
      ref: "RegisterComplain",
    },
  ],
  refreshToken: {
    type: String,
  },
});

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

adminSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

adminSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

adminSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

export const Admin = mongoose.model("Admin", adminSchema);

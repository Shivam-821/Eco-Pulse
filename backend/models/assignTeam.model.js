import mongoose,{Schema} from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

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
  address:{
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
    validate: {
      validator: function (value) {
        return /^[6-9]\d{9}$/.test(value.toString());
      },
    },
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

assignTeamSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

assignTeamSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

assignTeamSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

assignTeamSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

assignTeamSchema.index({ location: "2dsphere" });

export const AssignTeam = mongoose.model('AssignTeam', assignTeamSchema)
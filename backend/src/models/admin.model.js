import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

const adminSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  pincode:{
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
    unique: true,
  },
  adminOfficer: {
    type: String,
    required: true,
  },
  email:{
    type: String,
    requied: true,
    validate: {
      validator: function (value) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
      },
        
    },
  },
  phone: {
    type: Number,
    required: true,
    validate: {
        validator: function (value) {
          return /^[6-9]\d{9}$/.test(value.toString());
        },
      },
  },
  helpLineNumber:{
    type: Number,
  },
  password:{
    type: String,
    required: true,
  },
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
  complaintReceived: [
    {
        type: Schema.Types.ObjectId,
        ref: "RegisterComplain",
    },  
  ],
  refreshToken:{
    type: String,
  }
});

municipalitySchema.pre("save", async function(next){
  if(!this.isModified("password")) return next()

  this.password = await bcrypt.hash(this.password, 10)
  next()
})

municipalitySchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

municipalitySchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

municipalitySchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFERESH_TOKEN_SECRET,
    { expiresIn: process.env.REFERESH_TOKEN_EXPIRY }
  );
};


export const Admin = mongoose.model("Admin", adminSchema)
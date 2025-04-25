import jwt from "jsonwebtoken";
import { Admin, AssignTeam, User } from "../models/index.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const extractToken = (req) => {
  return req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
};

const verifyToken = (token) => {
  if (!token || token.split(".").length !== 3) {
    throw new ApiError(402, "Unauthorized: Invalid token format");
  }
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};

const verifyUser = asyncHandler(async (req, res, next) => {
  const token = extractToken(req);
  const decoded = verifyToken(token);
  const user = await User.findById(decoded._id).select("-password -refreshToken");

  if (!user) throw new ApiError(401, "Unauthorized");
  req.user = user;
  next();
});

const verifyAdmin = asyncHandler(async (req, res, next) => {
  const token = extractToken(req);
  const decoded = verifyToken(token);
  const admin = await Admin.findById(decoded._id).select("-password -refreshToken");

  if (!admin) throw new ApiError(401, "Unauthorized");
  req.admin = admin;
  next();
});

const verifyTeam = asyncHandler(async (req, res, next) => {
  const token = extractToken(req);
  const decoded = verifyToken(token);
  const team = await AssignTeam.findById(decoded._id).select("-password -refreshToken");

  if (!team) throw new ApiError(401, "Unauthorized");
  req.team = team;
  next();
});

export { verifyUser, verifyAdmin, verifyTeam };

import jwt from "jsonwebtoken";
import { AssignTeam } from "../models/assignTeam.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const verifyTeam = asyncHandler(async (req, res, next) => {
  const gettoken =
    req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
  if (!gettoken || gettoken.split(".").length !== 3) {
    throw new ApiError(402, "Unauthorized: No token provided");
  }

  try {
    const decodedToken = jwt.verify(gettoken, process.env.ACCESS_TOKEN_SECRET);
    const team = await AssignTeam.findById(decodedToken?._id).select("-refreshToken -password");

    if (!team) {
      throw new ApiError(401, "Unauthorized");
    }

    req.team = team;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

export { verifyTeam };

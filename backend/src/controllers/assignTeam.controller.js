import { AssignTeam } from "../models/assignTeam.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Regdump } from "../models/RegisterDump.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; 
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

const generateAccessAndRefreshToken = async (teamId) => {
  try {
    const team = await AssignTeam.findById(teamId);
    if (!team) {
      throw new ApiError(404, "Team not found");
    }

    const accessToken = team.generateAccessToken();
    const refreshToken = team.generateRefreshToken();
    team.refreshToken = refreshToken;

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

const registerTeam = asyncHandler(async (req, res) => {
  const { teamname, email, username, password, location } = req.body;

  if (
    [teamname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required.");
  }

  const existedTeam = await AssignTeam.findOne({
    $or: [{ teamname }, { email }],
  });

  if (existedTeam) {
    throw new ApiError(409, "Team with this name or email already exists.");
  }

  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  let avatar;
  try {
    avatar = await uploadOnCloudinary(avatarLocalPath);
  } catch (error) {
    throw new ApiError(500, "Failed to upload avatar");
  }

  try {
    const team = await AssignTeam.create({
      teamname,
      avatar: avatar?.url || "",
      email,
      password,
      location,
    });

    const createdTeam = await AssignTeam.findById(team._id).select(
      "-password -refreshToken"
    );

    if (!createdTeam) {
      throw new ApiError(
        500,
        "Something went wrong while registering the team"
      );
    }

    return res
      .status(201)
      .json(new ApiResponse(201, createdTeam, "Team registered successfully"));
  } catch (error) {
    if (avatar) await deleteFromCloudinary(avatar.public_id);

    throw new ApiError(
      500,
      "Something went wrong while registering the team. Avatar deleted."
    );
  }
});

const assignWork = asyncHandler(async (req, res) => {
  const { teamName, dumpId, location } = req.body;

  if (!teamName || !dumpId || !location) {
    throw new ApiError(400, "All fields are required");
  }

  const dump = await Regdump.findById(dumpId);
  if (!dump) {
    throw new ApiError(404, "Dump not found");
  }

  const team = await AssignTeam.findOne({ teamname: teamName });
  if (!team) {
    throw new ApiError(404, "No assign team found");
  }

  const [teamLat, teamLng] = team.location.coordinates;
  const [dumpLat, dumpLng] = dump.location.coordinates;

  const distanceInKm = getDistanceFromLatLonInKm(
    teamLat,
    teamLng,
    dumpLat,
    dumpLng
  );

  team.assignedWork.push(dump._id);
  await team.save();

  dump.teamAssigned = true;
  await dump.save();

  return res.status(200).json(
    new ApiResponse(200, {
      message: "Work assigned to team",
      distanceInKm: distanceInKm.toFixed(2),
    })
  );
});

const workCompleted = asyncHandler(async (req, res) => {
  const { dumpId } = req.query;

  if (!dumpId) {
    throw new ApiError(400, "Dump ID is required");
  }

  const dump = await Regdump.findById(dumpId);
  if (!dump) {
    throw new ApiError(404, "No dump found");
  }

  dump.completed = true;
  await dump.save();

  return res
    .status(200)
    .json(new ApiResponse(200, dump, "Dump marked as completed"));
});

export {
  registerTeam,
  assignWork,
  workCompleted,
  generateAccessAndRefreshToken,
};

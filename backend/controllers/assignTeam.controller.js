import { AssignTeam } from "../models/assignTeam.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Regdump } from "../models/index.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {notifyOnAssignTask} from "./twilio.controller.js"

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
    await team.save();

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

const registerTeam = asyncHandler(async (req, res) => {
  const { fullname, email, password, location, address, phone } = req.body;
  console.log(req.body)

  if ([fullname, email, password, address].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required.");
  }
  const teamname = fullname

  const existedTeam = await AssignTeam.findOne({
    $or: [{ teamname }, { email }],
  });

  if (existedTeam) {
    throw new ApiError(409, "Team with this name or email already exists.");
  }

  try {
    const team = await AssignTeam.create({
      teamname,
      email,
      password,
      location,
      address,
      phone,
    });

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      team._id
    );

    const createdTeam = await AssignTeam.findById(team._id).select(
      "-password -refreshToken"
    );

    if (!createdTeam) {
      throw new ApiError(500, "Something went wrong while registering a admin");
    }

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: "None",
    };

    return res
      .status(201)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          201,
          { user: createdTeam, accessToken, refreshToken },
          "Consumer registered and logged in successfully"
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      `Something went wrong while registering the team ${error.message}`
    );
  }
});

const loginTeam = asyncHandler(async (req, res) => {
  const { email, teamname, password } = req.body;

  if (!email && !teamname) {
    throw new ApiError(400, "Required field should be filled");
  }

  const team = await AssignTeam.findOne({ $or: [{ teamname }, { email }] });

  if (!team) {
    throw new ApiError(404, "Team not found");
  }

  const isPasswordValid = await team.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    team._id
  );

  const loggedInTeam = await AssignTeam.findById(team._id).select(
    "-password -refreshToken"
  );

  if (!loggedInTeam) {
    throw new ApiError(404, "User not found");
  }

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        201,
        { user: loggedInTeam, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

const getAllTeam = asyncHandler(async (req, res) => {
  const teams = await AssignTeam.find();

  if(!teams){
    throw new ApiError(404, "No assign team found")
  }

  return res
    .status(200)
    .json(new ApiResponse(200, teams, 'All teams fetched successfully'))
})

const assignTask = asyncHandler(async (req, res) => {
  const { teamName, dumpId, location, deadline } = req.body;

  if (!teamName || !dumpId || !location || !deadline) {
    throw new ApiError(400, "All fields are required");
  }

  const dump = await Regdump.findById(dumpId);
  if (!dump) {
    throw new ApiError(404, "Dump not found");
  }

  const team = await AssignTeam.findOne({ teamname: teamName });
  if (!team) {
    throw new ApiError(404, "Team not found");
  }

  const [dumpLat, dumpLng] = location; 
  const [teamLat, teamLng] = team.location.coordinates; 

 
  const distanceInKm = getDistanceFromLatLonInKm(
    teamLat,
    teamLng,
    dumpLat,
    dumpLng
  );


  team.assignedWork.push(dump._id);
  await team.save();

  dump.teamAssigned = true;
  dump.assignedTeam = team._id;
  await dump.save();

  await notifyOnAssignTask(teamName, dump.uniqueNumber, dump.address, distanceInKm.toFixed(2))

  return res.status(200).json(
    new ApiResponse(200, {
      message: "Task assigned successfully",
      distanceInKm: distanceInKm.toFixed(2),
      team: team.teamname,
      deadline: dump.deadline,
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

export { registerTeam, loginTeam, assignTask, workCompleted, getAllTeam };

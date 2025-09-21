import { Regdump } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/index.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { notifyOnRegisteringDump } from "./twilio.controller.js";

const registerDump = asyncHandler(async (req, res) => {
const { location, description, address } = req.body;
const dumpReporter = req.user

if (!location || !description || !address) {
  throw new ApiError(400, "All fields are required");
}

const [lat, lng] = location.split(",").map(Number);
if (isNaN(lat) || isNaN(lng)) {
  throw new ApiError(400, "Invalid location format");
}

const geoLocation = {
  type: "Point",
  coordinates: [lng, lat],
};


  let picture;
  const picturePath = req.file?.buffer;
  if (picturePath) {
    try {
      picture = await uploadOnCloudinary(picturePath);
    } catch (error) {
      return res.status(500).json(new ApiError(500, `Image upload failed: ${error.message}`));
    }
  }

  try {
    const dump = await Regdump.create({
      location: geoLocation,
      description,
      picture: picture?.secure_url || "",
      dumpReporter: dumpReporter._id,
      uniqueNumber: Math.floor(Math.random() * 999),
      address,
    });


    const registeredDump = await Regdump.findById(dump._id).populate({
      path: "dumpReporter",
      select: "fullname email avatar",
    });

    dumpReporter.dumpRegistered.push(dump._id);
    await dumpReporter.save();

    await notifyOnRegisteringDump(dumpReporter.fullname, dump.uniqueNumber)

    return res
      .status(201)
      .json(
        new ApiResponse(201, registeredDump, "Dump registered successfully")
      );
  } catch (error) {
    if (picture?.public_id) await deleteFromCloudinary(picture.public_id);
    return res.status(500).json(new ApiError(500, `Failed to create dump report: ${error.message}`));
  }
});

const getAllDump = asyncHandler(async (req, res) => {
  const dumps = await Regdump.find()
    .populate("dumpReporter assignedTeam")
    .select("-password -refreshToken");
    

  if (!dumps) throw new ApiError(404, "Dumps not found");

  return res
    .status(200)
    .json(new ApiResponse(200, dumps, "Dumps fetched successfully"));
});

export { getAllDump, registerDump };

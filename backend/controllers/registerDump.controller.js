import { Regdump } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/index.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { SmartBin } from "../models/index.js";

const registerDump = asyncHandler(async (req, res) => {
  const { location, description } = req.body;
  const dumpReporter = await User.findById(req.user._id);

  if (!dumpReporter || !location || !description || !type) {
    throw new ApiError(400, "All fields are required");
  }

  let picture;
  const picturePath = req.file?.path;
  if (picturePath) {
    try {
      picture = await uploadOnCloudinary(picturePath);
    } catch (error) {
      throw new ApiError(500, `Image upload failed: ${error.message}`);
    }
  }

  try {
    const dump = await Regdump.create({
      location,
      description,
      picture: picture?.url || "",
      dumpReporter: dumpReporter._id,
      uniqueNumber: Math.floor(Math.random() * 20),
    });

    const registeredDump = await Regdump.findById(dump._id).populate({
      path: "dumpReporter",
      select: "username fullname email avatar",
    });

    dumpReporter.dumpRegistered.push(dump._id);
    await dumpReporter.save();

    return res
      .status(201)
      .json(
        new ApiResponse(201, registeredDump, "Dump registered successfully")
      );
  } catch (error) {
    if (picture?.public_id) await deleteFromCloudinary(picture.public_id);
    throw new ApiError(500, `Failed to create dump report: ${error.message}`);
  }
});

const getAllDump = asyncHandler(async (req, res) => {
  const dumps = await Regdump.find()
    .populate("dumpReporter")
    .select("-password -refreshToken");

  if (!dumps) throw new ApiError(404, "Dumps not found");

  return res
    .status(200)
    .json(new ApiResponse(200, dumps, "Dumps fetched successfully"));
});

export { getAllDump, registerDump };

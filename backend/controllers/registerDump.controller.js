import { Regdump } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/index.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { queueNotification } from "../queues/notification.queue.js";
import { analyzeWasteImage } from "../services/aiService.js";
import sharp from "sharp";

const registerDump = asyncHandler(async (req, res) => {
  const { location, description, address } = req.body;
  const dumpReporter = req.user;

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
  if (req.file) {
    try {
      // Compress image before upload: resize to max 1280px, convert to webp at 70% quality.
      // Reduces a typical 3–5MB phone photo down to ~100–200KB, cutting Cloudinary upload time drastically.
      const compressedBuffer = await sharp(req.file.buffer)
        .resize({ width: 1280, height: 1280, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 70 })
        .toBuffer();
      picture = await uploadOnCloudinary(compressedBuffer);
    } catch (error) {
      return res
        .status(500)
        .json(new ApiError(500, `Image upload failed: ${error.message}`));
    }
  }

  let dump;
  try {
    dump = await Regdump.create({
      location: geoLocation,
      description,
      picture: picture?.secure_url || "",
      dumpReporter: dumpReporter._id,
      uniqueNumber: Math.floor(Math.random() * 999),
      address,
    });
  } catch (error) {
    if (picture?.public_id) await deleteFromCloudinary(picture.public_id);
    return res
      .status(500)
      .json(
        new ApiError(500, `Failed to create dump report: ${error.message}`),
      );
  }

  try {
    const registeredDump = await Regdump.findById(dump._id).populate({
      path: "dumpReporter",
      select: "fullname email avatar",
    });

    dumpReporter.dumpRegistered.push(dump._id);
    await dumpReporter.save();

    // queueing the notification
    queueNotification("registerDump", {
      dumpReporter: dumpReporter.fullname,
      uniqueCode: dump.uniqueNumber,
    }).catch((err) => console.error("Failed to queue dump notification:", err));

    // Send the response immediately — do NOT wait for AI
    res
      .status(201)
      .json(
        new ApiResponse(201, registeredDump, "Dump registered successfully"),
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiError(500, `Failed to finalize dump report: ${error.message}`),
      );
  }

  // --- AI Analysis & Gamification ---
  if (picture?.secure_url) {
    analyzeWasteImage(picture.secure_url)
      .then(async (aiAnalysis) => {
        dump.aiAnalysis = aiAnalysis;
        await dump.save();

        if (aiAnalysis.isWaste) {
          await User.findByIdAndUpdate(dumpReporter._id, {
            $inc: { credits: 10 },
          });
        }
      })
      .catch((aiError) => {
        console.error("Background AI analysis failed (dump already saved):", aiError);
      });
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

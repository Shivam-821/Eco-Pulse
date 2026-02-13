import { GeneralComplaint } from "../models/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Regdump } from "../models/index.js";

// we also need to get the district so that only that district municiplaity will be able to see those dumps and can assign to their district cleaning team.
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { analyzeWasteImage } from "../services/aiService.js";
import { User } from "../models/user.model.js";

const complaintRegistered = asyncHandler(async (req, res) => {
  const {
    complaintType,
    description,
    binUniqueCode,
    location,
    pincode,
    uniqueNumber,
  } = req.body;

  if (!complaintType || !description || !location) {
    return res.json(new ApiError(401, "All fields are required"));
  }

  if (complaintType === "bin-issue") {
    if (!binUniqueCode) {
      return res.json(new ApiError(401, "Bin - code is required"));
    }
  }

  // --- Image Upload & AI Analysis ---
  let imageUrl = "";
  let aiAnalysis = {};
  let creditsEarned = 0;

  if (req.file) {
    const fileBuffer = req.file.buffer;
    try {
      const cloudinaryResponse = await uploadOnCloudinary(fileBuffer);
      if (cloudinaryResponse) {
        imageUrl = cloudinaryResponse.secure_url;

        // Perform AI Analysis
        aiAnalysis = await analyzeWasteImage(imageUrl);

        // --- Gamification: Award Credits ---
        if (aiAnalysis.isWaste) {
          creditsEarned = 10;
          await User.findByIdAndUpdate(req.user._id, {
            $inc: { credits: creditsEarned },
          });
        }
      }
    } catch (error) {
      console.error("Image Upload/Analysis Error:", error);
      // Continue without AI analysis if it fails, but log it
    }
  }
  // ----------------------------------

  let getDump;
  if (uniqueNumber) {
    getDump = await Regdump.findOne({ uniqueNumber });
  }

  const assignedTeam = getDump?.assignedTeam;
  const address = getDump?.address;

  try {
    const createComplain = await GeneralComplaint.create({
      complaintType,
      description,
      relatedDump: getDump?._id,
      binUniqueCode,
      location: typeof location === "string" ? JSON.parse(location) : location, // Handle if sent as JSON string in FormData
      pincode,
      user: req.user._id,
      assignedTeam,
      address,
      imageUrl,
      aiAnalysis,
    });

    const createdComp = await GeneralComplaint.findById(
      createComplain._id,
    ).populate("relatedDump assignedTeam");

    if (getDump) {
      getDump.complainLodge = true;
      await getDump.save();
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { ...createdComp.toObject(), creditsEarned },
          creditsEarned > 0
            ? `Complaint raised successfully! You earned ${creditsEarned} Eco-Credits!`
            : "Complaint raised successfully",
        ),
      );
  } catch (error) {
    return res
      .status(501)
      .json(
        new ApiError(
          501,
          `Error generating Complain:: ComplainRegistered ${error.message}`,
        ),
      );
  }
});

const viewComplains = asyncHandler(async (req, res) => {
  const complains = await GeneralComplaint.find().sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, complains, "all complains fetched"));
});

export { complaintRegistered, viewComplains };

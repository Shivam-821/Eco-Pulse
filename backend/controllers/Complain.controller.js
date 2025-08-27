import { GeneralComplaint } from "../models/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Regdump } from "../models/index.js";

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
      return res.json(new ApiError(401,"Bin - code is required"))
    }
  }
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
      relatedDump: getDump._id,
      binUniqueCode,
      location,
      pincode,
      user: req.user._id,
      assignedTeam,
      address,
    });

    const createdComp = await GeneralComplaint.findById(
      createComplain._id
    ).populate("relatedDump assignedTeam");

    getDump.complainLodge = true,
    await getDump.save()

    return res
      .status(200)
      .json(new ApiResponse(200, createdComp, "Complain raised successfully"));
  } catch (error) {
    throw new ApiError(501, `Error generating Complain:: ComplainRegistered :: ${error.message}`);
  }
});

const viewComplains = asyncHandler(async (req, res) => {
  const complains = await GeneralComplaint.find().sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, complains, "all complains fetched"));
});

export { complaintRegistered, viewComplains };

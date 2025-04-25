import { GeneralComplaint } from "../models/ReportComplain.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Regdump} from "../models/RegisterDump.model.js"


const complaintRegistered = asyncHandler(async (req, res) => {
  const {complaintType, description, binUniqueCode, location, pincode, uniqueNumber} = req.body

  if(!complaintType || !description || !location || !pincode ) {
    throw new ApiError(402, "All fields are required:: complain.controller")
  }

  if(complaintType === "bin-issue"){
    if(!binUniqueCode){
        throw new ApiError(402, "binUniqueCode are required")
    }
  } 
  const getDump = await Regdump.findOne({uniqueNumber})

  try {
    const createComplain = await GeneralComplaint.create({
      complaintType,
      description,
      relatedDump: uniqueNumber?.getDump._id,
      binUniqueCode,
      location,
      pincode,
      user: req.user
    })


    return res
        .status(200)
        .json(new ApiResponse(200, createComplain, "Complain raised successfully"))
  } catch (error) {
        throw new ApiError(501, "Error generating Complain:: ComplainRegistered")
  }

  
})





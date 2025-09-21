import { Recycle } from "../models/recycle.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";


const createRecycle = asyncHandler(async (req, res) => {
    
    const recycler = req.user;
    const {recycableItems, description, quantity, address, location } = req.body;

    if(!address || !description || !recycableItems){
        return res.json(new ApiError(400, "All Fields are required"))
    }

    let image;
    const imagePath = req.file?.buffer;
    if(imagePath){
        try{
            image = await uploadOnCloudinary(imagePath)
        }
        catch (error){
            throw new ApiError(500, `Failed to upload item image: ${error.message}`)
        }
    }

    try {
        const recycle = await Recycle.create({
          recycableItems,
          user: recycler._id,
          description,
          address,
          quantity,
          location,
          image: image?.secure_url || "",
        });

        return res
            .status(201)
            .json(new ApiResponse(201, recycle, "Recycle Created Successfully"))

    } catch(err) {
        if(image?.public_id) await deleteFromCloudinary(image.public._id)
        console.log(500, "Failed to create item: ${error.message")
    }

})


const getAllRecycle = asyncHandler(async (req, res) => {
    const recycleItems = await Recycle.find().populate("user")

    if(!recycleItems){
        throw new ApiError(500, "Error fetching Data")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, recycleItems, "Recycle Items fetched successfully"))
})


export {createRecycle, getAllRecycle}
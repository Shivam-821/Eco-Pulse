import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Admin } from "../models/index.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await Admin.findById(userId);
    if (!user) {
      throw new ApiError(404, "Admin not found");
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      `Something went wrong while generating tokens ${error.message}`
    );
  }
};

const registerAdmin = asyncHandler(async (req, res) => {
  const { fullname, email, password, district, state, adminOfficer, pincode } =
    req.body;

  if (
    [fullname, email, password, district, state, adminOfficer].some(
      (field) => field?.trim() === ""
    )
  ) {
    return res.status(400).json(new ApiError(400, "All fields are required."));
  }

  const existedAdmin = await Admin.findOne({ $or: [{ district }, { email }] });

  if (existedAdmin) {
    return res
      .status(409)
      .json(new ApiError(409, "User with district or email already exists."));
  }

  try {
    const admin = await Admin.create({
      fullname,
      email,
      password,
      pincode,
      district,
      state,
      adminOfficer,
    });
    console.log(admin);

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      admin._id
    );

    const createdAdmin = await Admin.findById(admin._id).select(
      "-password -refreshToken"
    );

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
          { admin: createdAdmin, accessToken, refreshToken },
          "Admin registered and logged in successfully"
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          `Something went wrong while registering a admin`
        )
      );
  }
});

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, district, password } = req.body;

  if (!email && !district) {
    return res.status(400).json(new ApiError(400, "Required field should be filled"));
  }

  const admin = await Admin.findOne({ $or: [{ district }, { email }] });

  if (!admin) {
    return res.status(404).json(new ApiError(404, "Admin not found!, Please register Yourself"));
  }

  const isPasswordValid = await admin.isPasswordCorrect(password);
  if (!isPasswordValid) {
    return res.state(401).json(new ApiError(401, "Invalid credentials"));
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    admin._id
  );

  const loggedInAdmin = await Admin.findById(admin._id).select(
    "-password -refreshToken"
  );

  if (!loggedInAdmin) {
    throw new ApiError(404, "User not found");
  }

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        201,
        { user: loggedInAdmin, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

const getCurrentAdmin = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user details"));
});

export { registerAdmin, loginAdmin, getCurrentAdmin };

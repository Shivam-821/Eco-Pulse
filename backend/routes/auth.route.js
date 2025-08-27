import { Router } from "express";
import {
  verifyAdmin,
  verifyTeam,
  verifyUser,
  verifyAnyToken,
} from "../middleware/auth.middleware.js";
import {
  registerAdmin,
  loginAdmin,
  getCurrentAdmin,
} from "../controllers/admin.controller.js";
import {
  registerUser,
  loginUser,
  getCurrentUser,
} from "../controllers/user.controller.js";
import {
  loginTeam,
  registerTeam,
} from "../controllers/assignTeam.controller.js";
import { Admin } from "../models/admin.model.js";
import { User } from "../models/user.model.js";
import { AssignTeam } from "../models/assignTeam.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const router = Router();

// Admin authentication
router.route("/admin/signup").post(registerAdmin);
router.route("/admin/login").post(loginAdmin);
router.route("/admin/profile").get(verifyAdmin, getCurrentAdmin);

// User authentication
router.route("/user/signup").post(registerUser);
router.route("/user/login").post(loginUser);
router.route("/user/profile").get(verifyUser, getCurrentUser);

// Team authentication : Admin will create the Cleaning team
router.route("/team/signup").post(verifyAdmin, registerTeam);
router.route("/team/login").post(loginTeam);
// logic for profile doesn't exist till now
// router.route("/team/profile").get(verifyTeam, getTeam)

// adding unified verification of token
router.get("/verify-token", verifyAnyToken, (req, res) => {
  const { role, user, admin, team } = req;

  if (!role || (!user && !admin && !team)) {
    return res.status(400).json(new ApiResponse(400, {}, "User is logged out"));
  }

  return res.status(200).json({
    success: true,
    role,
    data: user || admin || team,
  });
});


// adding unified logout for all
router.route("/logout").get(
  verifyAnyToken,
  asyncHandler(async (req, res) => {
    if (req.role === "admin") {
      await Admin.findByIdAndUpdate(
        req.admin.id,
        {
          $unset: { refreshToken: "" },
        },
        { new: true }
      );
    } else if (req.role === "user") {
      await User.findByIdAndUpdate(
        req.user._id,
        {
          $unset: { refreshToken: "" },
        },
        { new: true }
      );
    } else if (req.role === "team") {
      await AssignTeam.findByIdAndUpdate(
        req.team._id,
        {
          $unset: { refreshToken: "" },
        },
        { new: true }
      );
    } else {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "No Account found"))
    }

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    };
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User logged out successfully"));
  })
);

export default router;

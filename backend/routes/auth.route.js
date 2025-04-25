import { Router } from "express";
import { verifyAdmin, verifyTeam, verifyUser } from "../middleware/auth.middleware.js";
import {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getCurrentAdmin,
} from "../controllers/admin.controller.js";
import {registerUser, loginUser, logoutUser, getCurrentUser} from '../controllers/user.controller.js'
import {loginTeam, registerTeam} from '../controllers/assignTeam.controller.js'

const router = Router();

// Admin authentication
router.route("/admin/signup").post(registerAdmin);
router.route("/admin/login").post(loginAdmin)
router.route("/admin/profile").get(verifyAdmin, getCurrentAdmin);



// User authentication
router.route("/user/signup").post(registerUser)
router.route("/user/login").post(loginUser)
router.route("/user/profile").get(verifyUser, getCurrentUser)

// Team authentication
router.route("/team/signup").post(registerTeam)
router.route('/team/login').post(loginTeam)
// logic for profile doesn't exist till now
// router.route("/team/profile").get(verifyTeam, getTeam) 





export default router;
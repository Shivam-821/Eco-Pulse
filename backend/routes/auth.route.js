import { Router } from "express";
import { verifyAdmin, verifyTeam, verifyUser, verifyAnyToken } from "../middleware/auth.middleware.js";
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

// Team authentication : Admin will create the Cleaning team
router.route("/team/signup").post(verifyAdmin, registerTeam)
router.route('/team/login').post(loginTeam)
// logic for profile doesn't exist till now
// router.route("/team/profile").get(verifyTeam, getTeam) 



// adding unified verification of token
router.get("/verify-token", verifyAnyToken, (req, res) => {
  const { role, user, admin, team } = req;

  return res.status(200).json({
    success: true,
    role,
    data: user || admin || team,
  });
});





export default router;
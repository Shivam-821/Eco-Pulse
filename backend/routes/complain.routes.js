import { Router } from "express";
import {
  complaintRegistered,
  viewComplains,
} from "../controllers/Complain.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";
import uploadMiddleware from "../middleware/upload.middleware.js";

const router = Router();

router
  .route("/loadge-complain")
  .post(verifyUser, uploadMiddleware, complaintRegistered);

router.route("/view-complain").get(viewComplains);

export default router;

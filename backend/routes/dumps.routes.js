import express from "express";
import upload from "../middleware/multer.middleware.js";
import { Regdump } from "../models/index.js";
import { verifyAdmin, verifyUser } from "../middleware/auth.middleware.js";
import { getAllDump, registerDump } from "../controllers/registerDump.controller.js";
import uploadMiddleware from "../middleware/upload.middleware.js";

const router = express.Router();

router.route('/report-dump').post(uploadMiddleware, verifyUser, registerDump)

router.route('/getall-dump').get(getAllDump)


export default router;
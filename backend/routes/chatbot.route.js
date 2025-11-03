import { Router } from "express";
import { responseMessage } from "../controllers/chatbot.controller.js";

const router = Router();

router.route("/get-response").post(responseMessage);

export default router;

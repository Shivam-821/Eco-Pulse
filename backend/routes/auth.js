import { User } from "../models/index.js";
import { Router } from "express";
import * as jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { verifyUser } from "../middleware/auth.middleware.js";
import { registerUser } from "../controllers/admin.controller.js";

const router = Router();

router.post("/signup", registerUser)

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET
  );
  res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
});

router.get("/profile", verifyUser, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ id: user._id, email: user.email, role: user.role });
});

export default router;
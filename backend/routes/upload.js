import express from "express";
import multer from "multer";
import path from "path";
import sharp from "sharp";

const router = express.Router(); // Create a router to define routes

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (![".png", ".jpg", ".jpeg"].includes(ext)) {
      return cb(new Error("Only .png, .jpg and .jpeg files are allowed"));
    }
    cb(null, true);
  },
});

export async function processImage(req, res, next) {
  if (!req.file) return next();

  const filename = `${Date.now()}-${req.file.originalname}`;
  const outputPath = path.join("uploads", filename);

  try {
    await sharp(req.file.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg")
      .jpeg({ quality: 70 })
      .toFile(outputPath);

    req.file.path = outputPath;
    req.file.filename = filename;
    next();
  } catch (err) {
    console.error("Image processing error:", err);
    return res.status(500).json({ error: "Failed to process image" });
  }
}

export const uploadMiddleware = upload.single("image");

// Define a route for file upload that uses the middleware
router.post("/", uploadMiddleware, processImage, (req, res) => {
  if (req.file && req.file.path) {
    res.status(200).json({ fileUrl: req.file.path });
  } else {
    res.status(400).json({ error: "No file uploaded" });
  }
});

export default router; // Export the router as default
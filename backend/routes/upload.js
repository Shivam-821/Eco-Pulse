const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');

const storage = multer.memoryStorage(); // store in memory for processing

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!['.png', '.jpg', '.jpeg'].includes(ext)) {
      return cb(new Error('Only .png, .jpg and .jpeg format allowed'));
    }
    cb(null, true);
  }
});

async function processImage (req, res, next)  {
  if (!req.file) return next();

  const filename = `${Date.now()}-${req.file.originalname}`;
  const outputPath = path.join('uploads', filename);

  try {
    await sharp(req.file.buffer)
      .resize({ width: 800, height: 800, fit: 'inside' }) // keep aspect ratio
      .toFormat('jpeg')
      .jpeg({ quality: 70 })
      .toFile(outputPath);

    req.file.path = outputPath;
    req.file.filename = filename;

    next();
  } catch (err) {
    console.error('Image processing error:', err);
    return res.status(500).json({ error: 'Failed to process image' });
  }
};

module.exports = {
  upload: upload.single('image'),
  processImage
};

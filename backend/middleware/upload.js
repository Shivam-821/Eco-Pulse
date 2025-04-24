const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    if (!['.png', '.jpg', '.jpeg'].includes(ext)) {
      return cb(new Error('Only images are allowed'));
    }
    cb(null, true);
  }
});

module.exports = upload;

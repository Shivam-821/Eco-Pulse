const router = require("express").Router();
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.single("file"), (req, res) => {
  res.json({ fileUrl: `https://dummyupload.com/${Date.now()}.jpg` });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const Dump = require('../models/Dump'); 
const { processImage } = require('./upload');

router.post('/report-dump', upload.single('image'),processImage, async (req, res) => {
  try {
    const newDump = new Dump({
      location: req.body.location,
      description: req.body.description,
      image: req.file.path
    });

    await newDump.save();
    res.status(201).json({ message: 'Reported successfully', dump: newDump });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to report dump' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const PickupRequest = require('../models/PickupRequest'); // Your PickupRequest model

// POST /request-pickup
router.post('/', async (req, res) => {
  const { name, address, contactNumber, wasteType, pickupDate } = req.body;

  // Validate input fields
  if (!name || !address || !contactNumber || !wasteType || !pickupDate) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Create new pickup request
    const newRequest = new PickupRequest({
      name,
      address,
      contactNumber,
      wasteType,
      pickupDate, // expected to be in 'YYYY-MM-DD' format
    });

    // Save the request to the database
    await newRequest.save();

    // Send success response
    res.status(200).json({ message: 'Pickup request saved successfully' });
  } catch (err) {
    console.error('Error saving pickup request:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

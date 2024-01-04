const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Get User Data by ID
router.get("/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).select('-password'); // Exclude password
    
        if (!user) {
          return res.status(404).send('User not found');
        }
    
        res.json(user);
      } catch (error) {
        res.status(500).send('Server error');
      }
});

// Additional user-related routes (e.g., update, delete) can be added here

module.exports = router;

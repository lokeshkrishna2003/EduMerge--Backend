const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Get User Data by ID
router.get("/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.json({ username: user.username, email: user.email }); // Send relevant user data
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while fetching user data.");
    }
});

// Additional user-related routes (e.g., update, delete) can be added here

module.exports = router;

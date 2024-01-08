const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { authenticateUser } = require('../middleware/auth'); // Ensure the correct path
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

// Update user profile



router.put('/update-profile/:userId',async (req, res) => {
    try {
        const userId = req.params.userId;
        const { username, email } = req.body;
    
        const updatedUser = await User.findByIdAndUpdate(userId, { username, email }, { new: true }).select('-password');
        res.status(200).json({ message: 'Profile updated successfully', updatedUser });
      } catch (error) {
        res.status(500).send(error.message);
      }
});

// Change password


router.put('/change-password/:userId',async (req, res) => {
    try {
        const userId = req.params.userId;
        const { oldPassword, newPassword } = req.body;
    
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).send('User not found');
        }
    
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
          return res.status(400).send('Incorrect old password');
        }
    
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();
    
        res.status(200).json({ message: 'Password changed successfully' });
      } catch (error) {
        res.status(500).send(error.message);
      }
});

// Delete user account
router.delete('/delete-account/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: 'Account deleted successfully' });
      } catch (error) {
        res.status(500).send(error.message);
      }
});

module.exports = router;



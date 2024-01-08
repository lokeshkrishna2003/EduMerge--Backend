const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Playlist = require('../models/Playlist');
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


//create playlist data

router.post('/create-playlist/:userId', async (req, res) => {
  try {
      const userId = req.params.userId;
      const { playlistName, links } = req.body;

      // Optional: Check if the user exists
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).send('User not found');
      }

      const newPlaylist = new Playlist({
          userId,
          playlistName,
          links
      });

      await newPlaylist.save();
      res.status(201).json({ message: 'Playlist created successfully', newPlaylist });
  } catch (error) {
      res.status(500).send(error.message);
  }
});

//edit playlist 

router.put('/edit-playlist/:playlistId', async (req, res) => {
  try {
      const { playlistId } = req.params;
      const { playlistName, links } = req.body;

      // Find the playlist by ID
      const playlist = await Playlist.findById(playlistId);
      if (!playlist) {
          return res.status(404).send('Playlist not found');
      }

      // Optional: Check if the user is the owner of the playlist
      if (playlist.userId.toString() !== req.user.id) { // Adjust based on your auth setup
          return res.status(401).send('User not authorized to edit this playlist');
      }

      // Update the playlist
      playlist.playlistName = playlistName;
      playlist.links = links; // Assuming you want to replace the entire links array
      await playlist.save();

      res.status(200).json({ message: 'Playlist updated successfully', playlist });
  } catch (error) {
      res.status(500).send(error.message);
  }
});

//delete playlist

module.exports = router;



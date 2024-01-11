const express = require("express");
const router = express.Router();


const bcrypt = require("bcrypt");
const { authenticateUser } = require("../middleware/auth"); // Ensure the correct path
// Get User Data by ID
router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).select("-password"); // Exclude password

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.json(user);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// Update user profile
router.put("/update-profile/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { username, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email },
      { new: true }
    ).select("-password");
    res
      .status(200)
      .json({ message: "Profile updated successfully", updatedUser });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Change password
router.put("/change-password/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).send("Incorrect old password");
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete user account
router.delete("/delete-account/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//create playlist data

router.post("/create-playlist/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { playlistName, links } = req.body;

    // Optional: Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    const newPlaylist = new Playlist({
      userId,
      playlistName,
      links,
    });

    await newPlaylist.save();
    res
      .status(201)
      .json({ message: "Playlist created successfully", newPlaylist });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//edit playlist

router.put("/edit-playlist/:playlistId", async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { playlistName, links } = req.body;

    // Find the playlist by ID and update
    const playlist = await Playlist.findByIdAndUpdate(
      playlistId,
      { playlistName, links },
      { new: true } // Returns the updated document
    );

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    res
      .status(200)
      .json({ message: "Playlist updated successfully", playlist });
  } catch (error) {
    console.error("Error updating playlist:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//delete playlist

router.delete("/delete-playlist/:playlistId", async (req, res) => {
  try {
    const { playlistId } = req.params;

    // Find the playlist by ID and delete
    const playlist = await Playlist.findByIdAndDelete(playlistId);
    if (!playlist) {
      return res.status(404).send("Playlist not found");
    }

    res.status(200).json({ message: "Playlist deleted successfully" });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// GET route to fetch a specific playlist by ID
router.get("/playlist/:playlistId", async (req, res) => {
  try {
    const { playlistId } = req.params;

    // Find the playlist by its ID
    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      // If the playlist is not found, send a 404 response
      return res.status(404).json({ message: "Playlist not found" });
    }

    // If the playlist is found, send it back in the response
    res.json(playlist);
  } catch (error) {
    // Handle any other errors
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET route to fetch playlists for a user
router.get("/playlists/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Find playlists by userId
    const playlists = await Playlist.find({ userId: userId });

    if (!playlists) {
      return res.status(404).send("No playlists found for this user");
    }

    res.status(200).json(playlists);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;

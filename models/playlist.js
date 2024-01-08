const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
    name: String,
    url: String
    // You can add more fields to each link as needed
});

const playlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    playlistName: {
        type: String,
        required: true
    },
    links: [linkSchema] // Array of links
    // Additional fields can be added as needed
});

module.exports = mongoose.model('Playlist', playlistSchema);

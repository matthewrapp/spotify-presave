var mongoose = require('mongoose');

const songSchema = mongoose.Schema({
    songName: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    artworkUrl: { type: String },
    spotifyUri: {type: String, required: true },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    presaved: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist' },
    path: { type: String, required: true }
});

module.exports = mongoose.model('Song', songSchema);
var mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: { type: String, required: false },
    spotifyAccessToken: { type: String, required: true, default: '' },
    spotifyRefreshToken: { type: String, required: true, default: '' },
    tokenType: { type: String, required: true, default: 'Bearer' },
    scope: { type: String, required: true, default: '' },
    followers: { type: Number, required: false },
    spotifyId: { type: String, required: false },
    href: { type: String, required: false },
    uri: { type: String, required: false },
    subscription: { type: String, required: false },
    country: { type: String, required: false }
});

module.exports = mongoose.model('User', userSchema);
var mongoose = require('mongoose');

const artistSchema = mongoose.Schema({
    artistName: { type: String, required: true },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true }
});

module.exports = mongoose.model('Artist', artistSchema);
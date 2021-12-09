const Artist = require('../models/Artist');

// GETTING ALL ARTISTS FROM DB WITH USER_ID
exports.getArtists = (req, res, next) => {
    Artist.find({ admin: req.user.userId })
        .then(artists => res.status(200).json({ message: 'Artists fetched successfully', artists: artists }))
        .catch(err => res.status(400).json({ message: 'Artists fetched failed', error: err }));
};
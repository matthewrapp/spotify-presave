var mongoose = require('mongoose');

const Song = require('../models/Song');
const Artist = require('../models/Artist');
const User = require('../models/User');

// GETTING ALL SONGS FROM DB FOR THE USER
exports.getSongs = async (req, res, next) => {
    console.log('getting here.....')
    const songs = await Song.find({ admin: req.user.userId }).then(songs => songs)
        .catch(err => res.status(400).json({ message: 'Songs fetched failed', error: err }));
        // res.status(200).json({ message: 'Songs fetched successfully', songs: songs })
    if (songs.length <= 0) return res.status(300).json({ message: 'No songs yet! Create one!' });

    const artist = await Artist.findById(songs[0].artist).catch(err => res.status(400).json({message: 'Failed getting artist info.'}));
    return res.status(200).json({ message: 'Songs fetched successfully', songs: songs, artist: artist })
};

exports.getSong = async (req, res, next) => {
    const song = await Song.findById(req.params.songId).catch(err => res.status(400).json({message: 'Failed getting song info.'}));;
    if (!song) return res.status(400).json({ message: 'Song doens\'t exist.' });

    return res.status(200).json({ message: 'Song fetched successfully', song: song});
}

// WRITE SONG TO DB FOR THE USER
exports.writePresave = (req, res, next) => {
    Song.find({ admin: req.user.userId })
        .then(async songs => {
            if (songs.length > 0) {
                const alreadyExists = songs.find(song => song.songName === req.body.songName);
                if (alreadyExists) return res.status(300).json({message: 'Song with same title already exists'});
            }

            const artist = await Artist.findById(req.body.artistId);

            const newPresave = new Song({ 
                songName: req.body.songName, 
                releaseDate: req.body.releaseDate, 
                artworkUrl: req.body.artworkUrl, 
                spotifyUri: req.body.spotifyUri, 
                admin: req.user.userId, 
                artist: req.body.artistId,
                path: `/${artist.artistName.split(' ').join('-').toLowerCase()}/s/${req.body.songName.split(' ').join('-').toLowerCase()}`
            });

            newPresave.save()
                .then(createdPresave => {
                    return res.status(200).json({ message: 'Presave added successfully', song: createdPresave })
                })
                .catch(err => res.status(400).json({ message: 'Admin added failed', error: err }))
            
        })
        .catch(err => console.log(err))
}

exports.updatePresave = async (req, res, next) => {
    const songToUpdate = await Song.findById(req.params.songId);
    if (!songToUpdate) return res.status(400).json({ message: 'Song doesn\'t exist.' });

    if (!req.body) return res.status(400).json({ message: 'No data in request. Must send data in request.' });

    const artist = await Artist.findById(req.body.artistId);

    const update = {
        songName: req.body.songName,
        releaseDate: req.body.releaseDate,
        artworkUrl: req.body.artworkUrl,
        path: `/${artist.artistName.split(' ').join('-').toLowerCase()}/s/${req.body.songName.split(' ').join('-').toLowerCase()}`
    }
    return songToUpdate.update(update)
        .then(savedSong => res.status(200).json({ updatedSong: songToUpdate, message: 'Song updated successfully!' }))
        .catch(err => res.status(400).json({ message: 'Song saved failed', error: err }))
}

exports.deleteSong = async (req, res, next) => {
    if (!req.params.songId) return res.status(400).json({ message: 'Must pass in a songId to delete a song.' });
    const deletedSong = await Song.findByIdAndDelete(req.params.songId);
    if (deletedSong === null) return res.status(400).json({ message: 'Song already deleted!' });
    return res.status(200).json({ message: 'Song deleted!' });
}

exports.getPresavePageData = async (req, res, next) => {
    const path = req.url;

    const song = await Song.find({ path: path }).then(songs => songs[0]);
    if (!song) return res.status(400).json({ message: 'This url doesn\'t exist' });

    // get artist by song.artist
    const artist = await Artist.findById({ _id: song.artist }).then(artist => artist);
    const songData = {
        artistId: artist._id,
        artistName: artist.artistName,
        songId: song._id,
        songName: song.songName,
        artworkUrl: song.artworkUrl,
        releaseDate: song.releaseDate,
        spotifyUri: song.spotifyUri,
    }

    return res.status(200).json({ message: 'Url fetched successfully!', songData: songData })
}

exports.queueSongToPresave = async (req, res, next) => {
    const spotifyUserId = req.body.spotifyUserId;
    const songToPresaveId = req.body.songId;

    const songFound = await Song.findById(songToPresaveId);
    if (!songFound) return res.status(300).json({message: 'Song doesn\'t exist.'});

    const newPresavedArr = songFound.presaved.slice();

    const userAlreadyPresaved = newPresavedArr.find(objectId => objectId.toString().split("(")[0] === spotifyUserId);

    if (userAlreadyPresaved) return res.status(300).json({message: 'Song already presaved!'});

    newPresavedArr.push(spotifyUserId);
    const update = { presaved: newPresavedArr };
    return songFound.update(update)
        .then(savedSong => res.status(200).json({ message: 'Presaved success!' }))
        .catch(err => res.status(400).json({ message: 'Error presaving song.', error: err }))
}

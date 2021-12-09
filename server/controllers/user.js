const User = require('../models/User');

// GETTING ALL USERS FROM DB
exports.getUsers = (req, res, next) => {
    User.find()
        .then(users => res.status(200).json({ message: 'Users fetched successfully', users: users }))
        .catch(err => res.status(400).json({ message: 'Users fetched failed', error: err }));
};

// GETTING ONE USER FROM DB
exports.getUser = (req, res, next) => {
    User.findOne({ _id: req.params.id })
        .then(users => res.status(200).json({ message: 'User fetched successfully', users: users }))
        .catch(err => res.status(400).json({ message: 'User fetched failed', error: err }));
};

// WRITING A USER TO DB
exports.writeUser = (req, res, next) => {
    if (!req.body.email) return res.status(300).json({ message: 'Must enter email' });
    if (!req.body.spotifyTokens) return res.status(300).json({ message: 'Must enter spotify tokens' });

    return User.find({ email: req.body.email })
        .then(response => {
            if (response.length > 0) return res.status(300).json({ message: 'User already exists.' });

            const user = new User({ email: req.body.email, spotifyTokens: req.body.spotifyTokens });

            user.save()
                .then(createdUser => res.status(200).json({ message: 'User added successfully', user: createdUser }))
                .catch(err => res.status(400).json({ message: 'Users added failed', error: err }))
                })
        .catch(err => console.log(err))
}
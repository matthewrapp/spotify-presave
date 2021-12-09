const Admin = require('../models/Admin');
const Artist = require('../models/Artist');

// middleware
const { hashPassword, comparePassword } = require('../middleware/password-hash');
const { generateToken } = require('../middleware/token');

// GETTING ALL USERS FROM DB
exports.getAdmins = (req, res, next) => {
    Admin.find()
        .then(admins => res.status(200).json({ message: 'Admins fetched successfully', admins: admins }))
        .catch(err => res.status(400).json({ message: 'Admins fetched failed', error: err }));
};

// GETTING ONE USER FROM DB
exports.getAdmin = (req, res, next) => {
    Admin.findOne({ _id: req.params.id })
        .then(admin => res.status(200).json({ message: 'Admin fetched successfully', admin: admin }))
        .catch(err => res.status(400).json({ message: 'Admin fetched failed', error: err }));
};

// GETTING USER INFO FOR LOGIN
exports.loginAdmin = (req, res, next) => {
    if (!req.body) return;
    Admin.findOne({ email: req.body.email})
        .then(admin => {
            if (!admin) return res.status(300).json({message: 'Admin doesn\'t exist. Please sign up.' })

            // compare passwords
            const passwordMatches = comparePassword(req.body.password, admin.password);
            if (!passwordMatches) return res.status(300).json({message: 'Password is wrong. Please try again' });
            return res.status(200)
                .json({
                    message: 'Admin signed in!',
                    token: admin.token,
                    adminId: admin._id,
                })

        })
        .catch(err => res.status(400).json({ message: 'Admin fetched failed', error: err }))
}

// WRITING A USER TO DB
exports.writeAdmin = (req, res, next) => { 
    if (!req.body.email) return res.status(300).json({ message: 'Must enter email' });
    if (!req.body.firstName) return res.status(300).json({ message: 'Must enter first name' });
    if (!req.body.lastName) return res.status(300).json({ message: 'Must enter last name' });
    if (!req.body.password) return res.status(300).json({ message: 'Must enter password' });
    if (!req.body.artistName) return res.status(300).json({ message: 'Must enter artist name' });

    Admin.find({ email: req.body.email })
        .then(response => {
            // check if admin email exists already
            if (response.length > 0) return res.status(300).json({ message: 'Admin already exists.' });

            // hash password
            const hashedPw = hashPassword(req.body.password);

            const admin = new Admin({ email: req.body.email, firstName: req.body.firstName, lastName: req.body.lastName, password: hashedPw, token: 'temp_token' });
            admin.save()
                .then(async createdAdmin => {
                    // generate token
                    const token = generateToken(createdAdmin._id, createdAdmin.email);
                    // overwrite the temp_token
                    createdAdmin.token = token;
                    // save the new token
                    await createdAdmin.save();
                    return createdAdmin
                })
                .then(createdAdmin => {
                    Artist.find({ admin: createdAdmin._id })
                        .then(async artists => {
                            if (artists.length > 0) {
                                const alreadyExists = songs.find(artist => artist.songName === req.body.artistName);
                                if (alreadyExists) return res.status(300).json({message: 'Artist with same name already exists'});
                            }

                            const newArtist = new Artist({ artistName: req.body.artistName, admin: createdAdmin._id });
                            await newArtist.save();
                            return newArtist;
                        })
                        .catch(err => res.status(400).json({ message: 'Artist added failed', error: err }));
                    return createdAdmin;
                })
                .then(createdAdmin => res.status(200).json({ message: 'Admin added successfully', admin: createdAdmin }))
                .catch(err => res.status(400).json({ message: 'Admin added failed', error: err }));

        })
        .catch(err => console.log(err))
}
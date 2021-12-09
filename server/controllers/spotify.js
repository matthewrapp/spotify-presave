var SpotifyWebApi = require('spotify-web-api-node');
const User = require('../models/User');
var spotifyApi = new SpotifyWebApi({
    clientId: `${process.env.SPOTIFY_CLIENT_ID}`,
    clientSecret: `${process.env.SPOTIFY_CLIENT_SECRET}`,
    redirectUri: `${process.env.REDIRECTURI}`
  });


exports.requestSpotifyTokens = async (req, res, next) => {
    const code = req.body.spotifyCode;
    if (!code) return res.status(400).json({ message: 'No spotify code in body of request' })

    const spotifyData = await spotifyApi.authorizationCodeGrant(code).then(data => data);
    if (!spotifyData) return res.status(400).json({ message: 'No spotify data returned from Spotify' })

    spotifyApi.setAccessToken(spotifyData.body.access_token);

    const spotifyUser = await spotifyApi.getMe().then(data => data);
    const userFound = await User.findOne({email: spotifyUser.body.email}); 

    if (userFound !== null) {
        const update = {
            spotifyAuthToken: spotifyData.body.access_token,
            spotifyRefreshToken: spotifyData.body.refresh_token,
            tokenType: spotifyData.body.token_type,
            followers: spotifyUser.body.followers.total,
        }
        return userFound.update(update)
            .then(savedUser => res.status(200).json({ spotifyUser: userFound, spotifyData: spotifyData.body, message: 'User saved success!' }))
            .catch(err => res.status(400).json({ message: 'User saved failed', error: err }))
    }

    const newUser = new User({
        email: spotifyUser.body.email,
        spotifyAccessToken: spotifyData.body.access_token,
        spotifyRefreshToken: spotifyData.body.refresh_token,
        tokenType: spotifyData.body.token_type,
        scope: spotifyData.body.scope,
        followers: spotifyUser.body.followers.total,
        spotifyId: spotifyUser.body.id,
        href: spotifyUser.body.href,
        uri: spotifyUser.body.uri,
        subscription: spotifyUser.body.product,
        country: spotifyUser.body.country
    });

    newUser.save()
        .then(createdUser => res.status(200).json({ spotifyUser: createdUser, spotifyData: spotifyData.body, message: 'User added success!' }))
        .catch(err => res.status(200).json({ error: err, message: 'User added failed!' }))
}

exports.requestSpotifyCode = async (req, res, next) => {
    const scopes = ['user-library-modify', 'user-follow-read', 'user-follow-modify', 'playlist-read-private', 'playlist-modify-private', 'user-read-email', 'user-read-private'];
    const state = process.env.SPOTIFY_STATE;
    const authUrl = await spotifyApi.createAuthorizeURL(scopes, state);
    return res.status(200).json({ authUrl: authUrl });
}
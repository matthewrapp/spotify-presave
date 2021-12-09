const express = require('express');
const router = express.Router();

const { requestSpotifyTokens, requestSpotifyCode  } = require('../controllers/spotify');

router.post('/spotify-code', requestSpotifyCode);
router.post('/spotify-tokens', requestSpotifyTokens);
module.exports = router;
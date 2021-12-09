const express = require('express');
const router = express.Router();

const { verifyAuth } = require('../middleware/token');

const { getArtists } = require('../controllers/artist');

router.get('/artists', verifyAuth, getArtists);

module.exports = router;
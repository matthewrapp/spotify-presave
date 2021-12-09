const express = require('express');
const router = express.Router();

const { verifyAuth } = require('../middleware/token');

const { getSongs, writePresave, getPresavePageData, queueSongToPresave, deleteSong } = require('../controllers/song');

router.get('/songs', verifyAuth, getSongs);
router.post('/create-presave', verifyAuth, writePresave);
router.post('/queue-presave', queueSongToPresave);
router.delete('/songs/:songId', deleteSong);

router.get('/:artistName/s/:songName', getPresavePageData);

module.exports = router;
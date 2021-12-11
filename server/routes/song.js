const express = require('express');
const router = express.Router();

const { verifyAuth } = require('../middleware/token');

const { getSongs, getSong, writePresave, getPresavePageData, queueSongToPresave, deleteSong, updatePresave } = require('../controllers/song');

router.get('/songs', verifyAuth, getSongs);
router.get('/songs/:songId', verifyAuth, getSong);
router.post('/create-presave', verifyAuth, writePresave);
router.post('/queue-presave', queueSongToPresave);
router.delete('/songs/:songId', deleteSong);
router.put('/songs/:songId', updatePresave);

router.get('/:artistName/s/:songName', getPresavePageData);

module.exports = router;
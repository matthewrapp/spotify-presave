const express = require('express');
const router = express.Router();

const { getUsers, getUser, writeUser } = require('../controllers/user');

router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.post('/users', writeUser);

module.exports = router;
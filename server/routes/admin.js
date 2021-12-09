const express = require('express');
const router = express.Router();

const { getAdmins, getAdmin, writeAdmin, loginAdmin } = require('../controllers/admin');

router.get('/admins', getAdmins);
router.get('/admins/:id', getAdmin);
router.post('/create-admin', writeAdmin);
router.post('/login-admin', loginAdmin)

module.exports = router;
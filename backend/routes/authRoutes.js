const express = require('express');
const router = express.Router();
const { loginAdmin, verifyDevice, logoutAdmin } = require('../controllers/authController');

// @route   POST /api/admin/login
router.post('/login', loginAdmin);

// @route   GET /api/admin/verify-device
router.get('/verify-device', verifyDevice);

// @route   POST /api/admin/logout
router.post('/logout', logoutAdmin);

module.exports = router;

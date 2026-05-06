const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../../controllers/public/settingsController');
const { verifyToken } = require('../../middleware/auth');
router.get('/', getSettings);
router.put('/', verifyToken, updateSettings);

module.exports = router;

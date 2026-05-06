const express = require('express');
const router = express.Router();
const { loginAdmin, verifyDevice, logoutAdmin } = require('../../controllers/admin/authController');
const { verifyToken } = require('../../middleware/auth');
const { validateAdminLogin, handleValidationErrors } = require('../../middleware/validators');

router.post('/login', validateAdminLogin, handleValidationErrors, loginAdmin);
router.get('/verify-device', verifyToken, verifyDevice);
router.post('/logout', verifyToken, logoutAdmin);

module.exports = router;

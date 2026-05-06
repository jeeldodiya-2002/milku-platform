const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const Admin = require('../../models/AdminModel');

// @desc    Admin Passphrase Login
// @route   POST /api/admin/login
const loginAdmin = async (req, res) => {
  try {
    const { passphrase } = req.body;

    if (!passphrase) {
      return res.status(400).json({ success: false, message: 'Please provide the secret passphrase' });
    }

    // Find our only admin record
    const admin = await Admin.findOne();
    if (!admin) {
      return res.status(500).json({ success: false, message: 'System error: Seed admin first' });
    }

    // Check if account is locked
    if (admin.lockUntil && admin.lockUntil > Date.now()) {
      return res.status(403).json({ 
        success: false, 
        message: `Account temporarily locked due to failed attempts. Try again after ${Math.ceil((admin.lockUntil - Date.now()) / 60000)} minutes.` 
      });
    }

    // Verify passphrase
    const isMatch = await admin.comparePassphrase(passphrase);
    if (!isMatch) {
      admin.failedAttempts += 1;
      // Lock for 10 minutes if 5 failures
      if (admin.failedAttempts >= 5) {
        admin.lockUntil = new Date(Date.now() + 10 * 60 * 1000); 
        admin.failedAttempts = 0; // reset for next attempt after lock
      }
      await admin.save();
      return res.status(401).json({ success: false, message: 'Invalid passphrase' });
    }

    // Reset attempts on success
    admin.failedAttempts = 0;
    admin.lockUntil = undefined;

    // Generate Device Token (UUID)
    const deviceToken = uuidv4();
    
    // Save device token in DB (limit to 5 devices for safety)
    if (admin.trustedDeviceTokens.length >= 10) {
      admin.trustedDeviceTokens.shift(); // Remove oldest device
    }
    admin.trustedDeviceTokens.push({ token: deviceToken });

    // Generate JWT for session
    const token = jwt.sign(
      { id: admin._id, deviceToken },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    await admin.save();

    res.status(200).json({
      success: true,
      token,
      deviceToken
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
};

// @desc    Verify Trusted Device for Auto-Login
// @route   GET /api/admin/verify-device
const verifyDevice = async (req, res) => {
  try {
    const deviceToken = req.headers['x-device-token'];
    
    if (!deviceToken) {
      return res.status(401).json({ success: false, message: 'No device token found' });
    }

    const admin = await Admin.findOne({ "trustedDeviceTokens.token": deviceToken });
    
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Device not recognized' });
    }

    // Return new JWT for the session
    const token = jwt.sign(
      { id: admin._id, deviceToken },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(200).json({ success: true, token });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Verification failed' });
  }
};

// @desc    Admin Logout (Revoke Device)
// @route   POST /api/admin/logout
const logoutAdmin = async (req, res) => {
  try {
    const deviceToken = req.headers['x-device-token'];
    const admin = await Admin.findOne();
    
    // Remove the current device from trusted list
    admin.trustedDeviceTokens = admin.trustedDeviceTokens.filter(t => t.token !== deviceToken);
    await admin.save();

    res.status(200).json({ success: true, message: 'Logged out and device revoked' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Logout failed' });
  }
};

module.exports = { loginAdmin, verifyDevice, logoutAdmin };

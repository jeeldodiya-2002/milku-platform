const Settings = require('../../models/SettingsModel');
const { getIO } = require('../../config/socket');

// @desc    Get Global Settings
// @route   GET /api/settings
const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({}); // Create default if none exists
    }
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Settings fetch failed' });
  }
};

// @desc    Update Global Settings (Admin Only)
// @route   PUT /api/settings
const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(req.body);
    } else {
      settings = await Settings.findByIdAndUpdate(settings._id, req.body, { returnDocument: 'after' });
    }

    // REAL-TIME SYNC: Emit event to all clients to refresh settings
    try {
        const io = getIO();
        io.emit('settings_updated', settings);
    } catch (socketErr) {
        console.error("Socket emission failed:", socketErr.message);
    }

    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Settings update failed' });
  }
};

module.exports = { getSettings, updateSettings };

const Settings = require('../../models/SettingsModel');
const { getIO } = require('../../config/socket');

// @desc    Get Global Settings
// @route   GET /api/settings
const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({}); 
    }

    // Auto-migration: If no branches, migrate top-level and add new main branch
    if (!settings.branches || settings.branches.length === 0) {
        settings.branches = [
            {
                name: "Main Branch (Sunak)",
                address: "R.S. No. 1881/001, Sunak-Maktupur Road, At: Sunak, Ta: Unjha, Di: Mehsana, Gujarat - 384170",
                email: "gdproduct4@gmail.com",
                phone: "8128164251",
                fssaiNumber: settings.fssaiNumber,
                googleMapsLink: "https://maps.app.goo.gl/SunakBranchLink", // Placeholder
                isMain: true
            },
            {
                name: "Surat Branch",
                address: settings.address || "22-A, Parmanand Industrial Society, Surat-395002",
                email: settings.email || "gdproduct3@gmail.com",
                phone: settings.whatsappNumber || "918347711123",
                fssaiNumber: settings.fssaiNumber,
                googleMapsLink: settings.googleMapsLink,
                isMain: false
            }
        ];
        await settings.save();
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

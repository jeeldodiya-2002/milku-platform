const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  // Only one passphrase for the entire system
  passphrase: {
    type: String,
    required: true
  },
  // List of UUID tokens for auto-login
  trustedDeviceTokens: [{
    token: { type: String, required: true },
    addedAt: { type: Date, default: Date.now },
    lastUsedAt: { type: Date, default: Date.now }
  }],
  // Rate limiting fields
  failedAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date }
}, { timestamps: true });

// Hash secret passphrase
adminSchema.pre('save', async function() {
  if (!this.isModified('passphrase')) return;
  const salt = await bcrypt.genSalt(10);
  this.passphrase = await bcrypt.hash(this.passphrase, salt);
});

// Helper for comparing passphrase
adminSchema.methods.comparePassphrase = async function(enteredPass) {
  return await bcrypt.compare(enteredPass, this.passphrase);
};

module.exports = mongoose.model('Admin', adminSchema);

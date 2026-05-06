const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  whatsappNumber: {
    type: String,
    required: true,
    default: "918347711123"
  },
  businessName: {
    type: String,
    default: "Milku"
  },
  email: {
    type: String,
    default: "gdproduct3@gmail.com"
  },
  address: {
    type: String,
    default: "22-A, Parmanand Industrial Society, Near Kharvarnagar BRTS Junction, U-M Road, Khatodara, Surat-395002"
  },
  fssaiNumber: {
    type: String,
    default: "10719014000677"
  },
  // Map Location Fields
  mapEmbedUrl: {
    type: String,
    default: ""
  },
  googleMapsLink: {
    type: String,
    default: ""
  },
  defaultWhatsAppMessage: {
    type: String,
    default: "Hi, I want to enquire about Milku products."
  }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);

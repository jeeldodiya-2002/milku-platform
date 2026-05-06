const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: {
    type: String,
    required: true,
    index: true
  },
  availableSizes: [{
    type: String,
    required: true
  }],
  brandColor: {
    type: String,
    default: "#1B9FDA"
  },
  shortDescription: { type: String, required: true },
  // DYNAMIC ASSET ENGINE
  frontImage: { type: String, default: '' },
  backImage: { type: String, default: '' },
  images: [{ type: String }], // Support for additional gallery images
  
  features: [{ type: String }], // Dynamic "Milku Excellence" points per product
  
  nutritionalInfo: {
    calories: { type: String, default: "N/A" },
    protein: { type: String, default: "N/A" },
    fat: { type: String, default: "N/A" },
    carbohydrates: { type: String, default: "N/A" },
    calcium: { type: String, default: "N/A" }
  },
  storageInstructions: { type: String, required: true },
  ingredients: [{ type: String }],
  specialTag: {
    type: String,
    enum: ['None', 'Premium', 'Glass Bottle', 'Best Seller'],
    default: 'None'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);

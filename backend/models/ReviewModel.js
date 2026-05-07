const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    reviewerName: {
        type: String,
        required: [true, 'Please provide your name'],
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    rating: {
        type: Number,
        required: [true, 'Please provide a rating'],
        min: 1,
        max: 5
    },
    reviewText: {
        type: String,
        required: [true, 'Please provide review text'],
        maxlength: [300, 'Review cannot exceed 300 characters'],
        trim: true
    },
    productName: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    approved: {
        type: Boolean,
        default: false
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    submitterIP: {
        type: String
    },
    // Google Data
    googleId: String,
    googleEmail: String,
    googleName: String,
    googleAvatar: String,
    googleVerified: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Index for preventing duplicate reviews (same user + same product) within 30 days
// We'll handle the 30-day logic in the controller, but indexing googleId is good.
reviewSchema.index({ googleId: 1 });
reviewSchema.index({ approved: 1 });

module.exports = mongoose.model('Review', reviewSchema);

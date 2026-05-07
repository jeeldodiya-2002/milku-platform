const express = require('express');
const router = express.Router();
const reviewController = require('../../controllers/public/reviewController');
const rateLimit = require('express-rate-limit');

// Rate limit for review submission: max 3 per IP per day
const reviewSubmitLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 3,
    message: { 
        success: false, 
        message: 'You have reached the maximum number of reviews allowed per day from this connection. Please try again tomorrow.' 
    }
});

router.get('/', reviewController.getReviews);
router.post('/', reviewSubmitLimiter, reviewController.submitReview);

module.exports = router;

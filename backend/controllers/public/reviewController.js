const Review = require('../../models/ReviewModel');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * @desc    Get all reviews with pagination and stats
 * @route   GET /api/reviews
 * @access  Public
 */
exports.getReviews = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const skip = (page - 1) * limit;

        // Fetch reviews
        const reviews = await Review.find()
            .sort({ submittedAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalReviews = await Review.countDocuments();

        // Calculate Stats
        const stats = await Review.aggregate([
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" },
                    totalCount: { $sum: 1 },
                    star5: { $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] } },
                    star4: { $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] } },
                    star3: { $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] } },
                    star2: { $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] } },
                    star1: { $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] } }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: reviews,
            stats: stats[0] || {
                averageRating: 0,
                totalCount: 0,
                star5: 0,
                star4: 0,
                star3: 0,
                star2: 0,
                star1: 0
            },
            pagination: {
                total: totalReviews,
                page,
                pages: Math.ceil(totalReviews / limit)
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * @desc    Submit a new review
 * @route   POST /api/reviews
 * @access  Public (Requires Google Token)
 */
exports.submitReview = async (req, res) => {
    try {
        const { googleToken, rating, reviewText, productName, city, location } = req.body;

        if (!googleToken) {
            return res.status(401).json({ success: false, message: 'Google authentication required' });
        }

        // Verify Google Token
        let payload;
        try {
            const ticket = await client.verifyIdToken({
                idToken: googleToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            payload = ticket.getPayload();
        } catch (error) {
            return res.status(401).json({ success: false, message: 'Invalid Google token' });
        }

        const { sub: googleId, email: googleEmail, name: googleName, picture: googleAvatar } = payload;

        // Check for duplicate: same googleId + same product within last 30 days
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const existingReview = await Review.findOne({
            googleId,
            productName,
            submittedAt: { $gte: thirtyDaysAgo }
        });

        if (existingReview) {
            return res.status(409).json({
                success: false,
                message: 'You have already reviewed this product recently. Please wait 30 days before submitting another review.'
            });
        }

        const newReview = await Review.create({
            reviewerName: googleName,
            location: location || city,
            rating,
            reviewText,
            productName,
            city,
            submitterIP: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress,
            googleId,
            googleEmail,
            googleName,
            googleAvatar,
            verified: true,
            approved: true // Set to true by default as requested
        });

        res.status(201).json({
            success: true,
            message: 'Thank you! Your review has been published successfully.',
            data: newReview
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * @desc    Get all reviews for management
 * @route   GET /api/admin/reviews/pending
 * @access  Private (Admin)
 */
exports.adminGetPending = async (req, res) => {
    try {
        // Fetch all reviews for admin moderation/deletion
        const reviews = await Review.find().sort({ submittedAt: -1 });
        res.status(200).json({ success: true, data: reviews });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * @desc    Approve a review
 * @route   PUT /api/admin/reviews/:id/approve
 * @access  Private (Admin)
 */
exports.adminApprove = async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(req.params.id, { 
            approved: true,
            verified: true 
        }, { new: true });
        
        if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
        
        res.status(200).json({ success: true, message: 'Review approved and published' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * @desc    Delete a review
 * @route   DELETE /api/admin/reviews/:id
 * @access  Private (Admin)
 */
exports.adminDelete = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
        res.status(200).json({ success: true, message: 'Review deleted permanently' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

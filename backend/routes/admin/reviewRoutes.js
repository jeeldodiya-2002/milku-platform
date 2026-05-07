const express = require('express');
const router = express.Router();
const reviewController = require('../../controllers/public/reviewController');
const { protect } = require('../../middleware/authMiddleware'); // Verify existing middleware name

router.use(protect); // All admin review routes are protected

router.get('/pending', reviewController.adminGetPending);
router.put('/:id/approve', reviewController.adminApprove);
router.delete('/:id', reviewController.adminDelete);

module.exports = router;

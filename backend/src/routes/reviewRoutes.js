const express = require('express');
const router = express.Router();
const { createReview, getBookReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createReview);
router.get('/book/:bookId', getBookReviews);

module.exports = router;
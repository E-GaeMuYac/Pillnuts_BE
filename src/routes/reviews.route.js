const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authUser.middleware');

const ReviewsController = require('../architecture/controllers/reviews.controller');
const reviewsController = new ReviewsController();

// 리뷰 작성
router.post('/:medicineId', authMiddleware, reviewsController.createReview);


module.exports = router;

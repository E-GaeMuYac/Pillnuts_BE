const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authUser.middleware');

const ReviewsController = require('../architecture/controllers/reviews.controller');
const reviewsController = new ReviewsController();

router.post('/:medicineId', authMiddleware, reviewsController.createReview);
// router.get('/', authMiddleware, reviewsController.findReview);

module.exports = router;

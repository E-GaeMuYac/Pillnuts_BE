const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authUser.middleware');

const ReviewsController = require('../architecture/controllers/reviews.controller');
const authCheckMiddleware = require('../middlewares/authCheck.middleware');
const reviewsController = new ReviewsController();

router.post('/:medicineId', authMiddleware, reviewsController.createReview);
router.get('/', authCheckMiddleware, reviewsController.findReview);
router.put('/:reviewId', authMiddleware, reviewsController.updateReview);
router.delete('/:reviewId', authMiddleware, reviewsController.deleteReview);

router.get('/myreview', authMiddleware, reviewsController.findMyReview);

router.put(
  '/:reviewId/like',
  authMiddleware,
  reviewsController.checkReviewLike
);
router.put(
  '/:reviewId/dislike',
  authMiddleware,
  reviewsController.checkReviewDislike
);

module.exports = router;

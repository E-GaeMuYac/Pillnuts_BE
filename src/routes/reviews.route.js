const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authUser.middleware');

const ReviewsController = require('../architecture/controllers/reviews.controller');
const authCheckMiddleware = require('../middlewares/authCheck.middleware');
const reviewsController = new ReviewsController();

// 리뷰 등록
router.post('/:medicineId', authMiddleware, reviewsController.createReview);
// 리뷰 조회
router.get('/', authCheckMiddleware, reviewsController.findReview);
// 리뷰 수정
router.put('/:reviewId', authMiddleware, reviewsController.updateReview);
// 리뷰 삭제
router.delete('/:reviewId', authMiddleware, reviewsController.deleteReview);
// 마이페이지에서 리뷰 조회
router.get('/myreview', authMiddleware, reviewsController.findMyReview);
// 리뷰에 도움돼요 누르기
router.put(
  '/:reviewId/like',
  authMiddleware,
  reviewsController.checkReviewLike
);
// 리뷰에 도움 안돼요 누르기
router.put(
  '/:reviewId/dislike',
  authMiddleware,
  reviewsController.checkReviewDislike
);
// 리뷰 (신고하기)
router.put('/:reviewId/report', authMiddleware, reviewsController.checkReviewReport);

module.exports = router;

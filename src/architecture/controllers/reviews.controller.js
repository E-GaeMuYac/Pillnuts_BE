const ReviewService = require('../services/reviews.service');

class ReviewController {
  reviewService = new ReviewService();

  createReview = async (req, res, next) => {
    try {
      const { medicineId } = req.params;
      const { userId } = res.locals;
      const { review } = req.body;
      
      await this.reviewService.createReview(medicineId, userId, review);
      res.status(200).json({ message: '댓글 등록이 완료되었습니다' });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = ReviewController;

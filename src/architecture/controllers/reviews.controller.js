const ReviewService = require('../services/reviews.service');
const {
  InvalidParamsError,
} = require('../../middlewares/exceptions/error.class');
const { ValidationError } = require('sequelize');

class ReviewController {
  reviewService = new ReviewService();

  createReview = async (req, res, next) => {
    try {
      const { medicineId } = req.params;
      const { userId } = res.locals;
      const { review } = req.body;

      if (!review) {
        throw new InvalidParamsError();
      }

      await this.reviewService.createReview(medicineId, userId, review);
      res.status(200).json({ message: '댓글 등록이 완료되었습니다' });
    } catch (error) {
      next(error);
    }
  };

  findReview = async (req, res, next) => {
    try {
      let { medicineId, page, pageSize } = req.query;
      const loginUserId = res.locals.userId;

      if (!page || page <= 0) page = 1;
      if (!pageSize || pageSize <= 0) pageSize = 20;

      const reviews = await this.reviewService.findReview(
        medicineId,
        page,
        pageSize,
        loginUserId
      );
      return res.status(200).json(reviews);
    } catch (error) {
      next(error);
    }
  };

  updateReview = async (req, res, next) => {
    try {
      const { reviewId } = req.params;
      const { userId } = res.locals;
      const { review } = req.body;

      if (!review) {
        throw new ValidationError('리뷰를 작성해주세요.', 412);
      }
      await this.reviewService.updateReview(reviewId, review, userId);
      return res.status(200).json({ message: '리뷰 수정 완료' });
    } catch (error) {
      next(error);
    }
  };
  deleteReview = async (req, res, next) => {
    try {
      let { reviewId } = req.params;
      const { userId } = res.locals;

      await this.reviewService.deleteReview(reviewId, userId);
      return res.status(200).json({ message: '리뷰를 삭제하였습니다.' });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = ReviewController;

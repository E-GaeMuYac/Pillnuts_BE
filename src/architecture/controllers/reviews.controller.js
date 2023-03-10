const ReviewService = require('../services/reviews.service');
const {
  InvalidParamsError,
  ValidationError,
} = require('../../middlewares/exceptions/error.class');

class ReviewController {
  reviewService = new ReviewService();

  // 리뷰 작성
  createReview = async (req, res, next) => {
    try {
      const { medicineId } = req.params;
      const { userId } = res.locals;
      const { review } = req.body;

      if (!review) {
        throw new InvalidParamsError();
      }

      await this.reviewService.createReview(medicineId, userId, review);
      return res.status(200).json({ message: '리뷰 등록이 완료되었습니다' });
    } catch (error) {
      next(error);
    }
  };

  // 리뷰 조회
  findReview = async (req, res, next) => {
    try {
      let { medicineId, page, pageSize, tag, order } = req.query;
      const loginUserId = res.locals.userId;

      if (!page || page <= 0) page = 1;
      if (!pageSize || pageSize <= 0) pageSize = 20;

      const reviews = await this.reviewService.findReview(
        medicineId,
        page,
        pageSize,
        tag,
        order,
        loginUserId
      );
      return res.status(200).json(reviews);
    } catch (error) {
      next(error);
    }
  };

  // 리뷰 수정
  updateReview = async (req, res, next) => {
    try {
      const { reviewId } = req.params;
      const { userId } = res.locals;
      const { review } = req.body;

      if (!review) {
        throw new ValidationError('리뷰를 작성해주세요.', 412);
      }
      await this.reviewService.updateReview(reviewId, review, userId);
      return res.status(200).json({ message: '리뷰 수정이 완료되었습니다.' });
    } catch (error) {
      next(error);
    }
  };

  // 리뷰 삭제
  deleteReview = async (req, res, next) => {
    try {
      const { reviewId } = req.params;
      const { userId } = res.locals;

      await this.reviewService.deleteReview(reviewId, userId);
      return res.status(200).json({ message: '리뷰를 삭제하였습니다.' });
    } catch (error) {
      next(error);
    }
  };

  // 마이페이지에서 리뷰 조회
  findMyReview = async (req, res, next) => {
    try {
      let { page, pageSize } = req.query;
      const { userId } = res.locals;

      if (!page || page <= 0) page = 1;
      if (!pageSize || pageSize <= 0) pageSize = 20;

      const reviews = await this.reviewService.findMyReview(
        userId,
        page,
        pageSize
      );
      return res.status(200).json(reviews);
    } catch (error) {
      next(error);
    }
  };

  // 리뷰 (도움 돼요 누르기)
  checkReviewLike = async (req, res, next) => {
    try {
      const { reviewId } = req.params;
      const { userId } = res.locals;

      if (!reviewId) {
        throw new InvalidParamsError('요청한 형식이 올바르지 않습니다.', 400);
      }

      const isLike = await this.reviewService.checkReviewLike(reviewId, userId);

      if (!isLike) {
        return res.status(201).json({ message: '리뷰에 도움 돼요 취소' });
      }

      res.status(201).json({
        message: '리뷰에 도움 돼요 성공',
      });
    } catch (error) {
      next(error);
    }
  };

  // 리뷰 (도움 안돼요 누르기)
  checkReviewDislike = async (req, res, next) => {
    try {
      const { reviewId } = req.params;
      const { userId } = res.locals;

      if (!reviewId) {
        throw new InvalidParamsError('요청한 형식이 올바르지 않습니다.', 400);
      }

      const isDislike = await this.reviewService.checkReviewDislike(
        reviewId,
        userId
      );

      if (!isDislike) {
        return res.status(201).json({ message: '리뷰에 도움 안돼요 취소' });
      }

      res.status(201).json({
        message: '리뷰에 도움 안돼요 성공',
      });
    } catch (error) {
      next(error);
    }
  };

  // 리뷰 (신고하기)
  checkReviewReport = async (req, res, next) => {
    try {
      const { reviewId } = req.params;
      const { userId } = res.locals;

      if (!reviewId) {
        throw new InvalidParamsError('요청한 형식이 올바르지 않습니다.', 400);
      }

      const { status, message } = await this.reviewService.checkReviewReport(
        reviewId,
        userId
      );
      res.status(status).json({ message });

    } catch (error) {
      next(error);
    }
  };
}

module.exports = ReviewController;

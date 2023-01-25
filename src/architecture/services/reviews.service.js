const ReviewRepository = require('../repositories/reviews.repository');
const { Users } = require('../../models');
const {
  InvalidParamsError,
} = require('../../middlewares/exceptions/error.class');

class ReviewService {
  constructor() {
    this.reviewRepository = new ReviewRepository();
  }

  createReview = async (medicineId, userId, review) => {
    await this.reviewRepository.createReview(medicineId, userId, review);
  };

  findReview = async (medicineId, page, pageSize, loginUserId, reviewId) => {
    const reviews = await this.reviewRepository.findReview({
      raw: true,
      where: { medicineId },
      include: [
        {
          model: Users,
          attributes: ['nickname'],
        },
      ],

      offset: (page - 1) * pageSize,
      limit: Number(pageSize),
    });
    return reviews.map((review) => {
      return {
        reviewId: review.reviewId,
        userId: review.userId,
        medicineId: review.medicineId,
        review: review.review,
        updatedAt: review.updatedAt,
        nickname: review['User.nickname'],
      };
    });
  };

  updateReview = async (reviewId, review, userId) => {
    const changeReview = await this.reviewRepository.findOneReview(reviewId);

    if (changeReview == null || changeReview.length === 0) {
      throw new InvalidParamsError('리뷰를 찾을 수 없습니다.', 404);
    }

    if (userId !== changeReview.userId) {
      throw new InvalidParamsError('유저 권한이 없습니다.', 401);
    }
    await this.reviewRepository.updateReview(review, reviewId);
    return this.reviewRepository.findOneReview(reviewId);
  };

  deleteReview = async (reviewId, userId) => {
    const delReview = await this.reviewRepository.findOneReview(reviewId);

    if (delReview == null || delReview.length === 0) {
      throw new InvalidParamsError('리뷰를 찾을 수 없습니다.', 404);
    }
    if (delReview.userId !== userId || userId == undefined) {
      throw new InvalidParamsError('유저 권한이 없습니다.', 401);
    }
    return this.reviewRepository.deleteReview(reviewId);
  };
}

module.exports = ReviewService;

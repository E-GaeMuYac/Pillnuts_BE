const ReviewRepository = require('../repositories/reviews.repository');

class ReviewService {
  constructor() {
    this.reviewRepository = new ReviewRepository();
  }

  createReview = async (medicineId, userId, review) => {
    await this.reviewRepository.createReview(medicineId, userId, review);
  };

  findReview = async (medicineId) => {
    const review = await this.reviewsRepository.findReview(medicineId);
    if (!review) {
      throw new Error('리뷰 조회에 실패하였습니다.');
    }
    return review;
  };
}

module.exports = ReviewService;

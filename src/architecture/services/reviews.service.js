const ReviewRepository = require('../repositories/reviews.repository');

class ReviewService {
  constructor() {
    this.reviewRepository = new ReviewRepository();
  }

  createReview = async (medicineId, userId, review) => {
    console.log(review)
    await this.reviewRepository.createReview(medicineId, userId, review);
  };
}

module.exports = ReviewService;

const ReviewRepository = require('../repositories/reviews.repository');
const ProductRepository = require('../repositories/products.repository');
const {
  InvalidParamsError,
} = require('../../middlewares/exceptions/error.class');

class ReviewService {
  reviewRepository = new ReviewRepository();
  productRepository = new ProductRepository();

  createReview = async (medicineId, userId, review) => {
    // const product = await this.productRepository.findOneMedicine(medicineId);

    // if (product == null) {
    //   throw new InvalidParamsError('약품을 찾을 수 없습니다.', 404);
    // }
    const createReviews = await this.reviewRepository.createReview(
      medicineId,
      userId,
      review
    );
    return this.reviewRepository.findOneMedicine(createReviews);
  };
}

module.exports = ReviewService;

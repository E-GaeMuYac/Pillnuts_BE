const ReviewService = require('../services/reviews.service');
const { ValidationError } = require('../../middlewares/exceptions/error.class');

class ReviewController {
  reviewService = new ReviewService();

  createReview = async (req, res, next) => {
    try {
      const { medicineId } = req.params;
      const { userId } = res.locals;
      const { review } = req.body;

      if (!medicineId || !userId || !review) {
        throw new ValidationError();
      }

      const data = await this.reviewService.createReview(
        medicineId,
        userId,
        review
      );
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = ReviewController;

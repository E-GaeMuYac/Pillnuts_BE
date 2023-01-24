const ReviewService = require('../services/reviews.service');
const { InvalidParamsError, } = require('../../middlewares/exceptions/error.class');
const {AuthenticationError } = require('../../middlewares/authUser.middleware');

class ReviewController {
  reviewService = new ReviewService();

  createReview = async (req, res, next) => {
    try {
      const { medicineId } = req.params;
      const { userId } = res.locals;
      const { review } = req.body;

      if(!review) {
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
      const { medicineId, page, pageSize } = req.query;
      const {refreshtoken} = req.headers;

      if(!refreshtoken){
        throw new AuthenticationError();
      }
      
      await this.reviewsService.findReview(medicineId);
      return res.status(200).json(medicineId);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = ReviewController;

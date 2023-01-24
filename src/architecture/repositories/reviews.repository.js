const { Reviews } = require('../../models');

class ReviewRepository {
  createReview = async (medicineId, userId, review) => {
    await Reviews.create({ medicineId, userId, review });
  };

  // findReview = async (reviewId) => {
  //   const review = await Reviews.findOne({
  //     where: {reviewId},
  //     attribute: ['reviewId'],
  //   });
  //   return review;
  // };
}

module.exports = ReviewRepository;

const { Reviews } = require('../../models');


class ReviewRepository {
  createReview = async (medicineId, userId, review) => {
    await Reviews.create({medicineId, userId,  review});
  };
}

module.exports = ReviewRepository;

const { Reviews, Users } = require('../../models');

class ReviewRepository {
  createReview = async (medicineId, userId, review) => {
    await Reviews.create({ medicineId, userId, review });
  };

  findReview = async (data) => {
    return Reviews.findAll(data);
  };

  findOneReview = async (reviewId) => {
    const review = await Reviews.findOne({
      where: { reviewId },
      attributes: ['reviewId', 'userId', 'review', 'updatedAt'],
      include: {
        model: Users,
        attributes: ['nickname'],
      },
      raw: true,
    });
    return review;
  };

  updateReview = async (review, reviewId) => {
    return Reviews.update({ review }, { where: { reviewId } });
  };

  deleteReview = async (reviewId) => {
    return Reviews.destroy({ where: { reviewId } });
  };
}

module.exports = ReviewRepository;

const { Reviews, Users } = require('../../models');

class ReviewRepository {
  createReview = async (medicineId, userId, review) => {
    await Reviews.create({ medicineId, userId, review });
  };

  findReview = async (data) => {
    return Reviews.findAll(data);
  };

  findOneReview = async (reviewId) => {
    return Reviews.findOne({
      where: { reviewId },
      attributes: ['reviewId', 'userId', 'review', 'updatedAt'],
      include: {
        model: Users,
        attributes: ['nickname'],
      },
      raw: true,
    });
  };

  updateReview = async (review, reviewId) => {
    return Reviews.update({ review }, { where: { reviewId } });
  };

  deleteReview = async (reviewId) => {
    return Reviews.destroy({ where: { reviewId } });
  };
}

module.exports = ReviewRepository;

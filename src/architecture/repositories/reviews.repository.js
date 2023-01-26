const { Reviews, Users, Likes, Dislikes } = require('../../models');

class ReviewRepository {
  createReview = async (medicineId, userId, review) => {
    await Reviews.create({ medicineId, userId, review });
  };

  findReview = async (data) => {
    return Reviews.findAll(data);
  };

  findOneReview = async (reviewId) => {
    return Reviews.findOne({
      raw: true,
      where: { reviewId },
      attributes: ['reviewId', 'userId', 'review', 'updatedAt'],
      include: {
        model: Users,
        attributes: ['nickname'],
      },
    });
  };

  findLike = async (reviewId, userId) => {
    return Likes.findOne({
      raw: true,
      where: { reviewId, userId },
    });
  };

  findDislike = async (reviewId, userId) => {
    return Dislikes.findOne({
      raw: true,
      where: { reviewId, userId },
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

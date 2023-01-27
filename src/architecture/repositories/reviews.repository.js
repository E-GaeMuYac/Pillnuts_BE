const { Reviews, Users, Likes, Dislikes } = require('../../models');

class ReviewRepository {
  // 리뷰 작성
  createReview = async (medicineId, userId, review) => {
    await Reviews.create({ medicineId, userId, review });
  };

  // 리뷰 조회
  findReview = async (data) => {
    return Reviews.findAll(data);
  };

  findOneReview = async (reviewId) => {
    return Reviews.findOne({
      raw: true,
      where: { reviewId },
      include: [
        {
          model: Users,
          attributes: ['nickname'],
        },
        {
          model: Likes,
          as: 'Likes',
          attributes: [],
          duplicating: false,
          required: false,
        },
        {
          model: Dislikes,
          as: 'Dislikes',
          attributes: [],
          duplicating: false,
          required: false,
        },
      ],
      attributes: [
        'reviewId',
        'userId',
        'medicineId',
        'review',
        'updatedAt',
        [
          Likes.sequelize.fn('count', Likes.sequelize.col('Likes.reviewId')),
          'likeCount',
        ],
        [
          Dislikes.sequelize.fn(
            'count',
            Dislikes.sequelize.col('Dislikes.reviewId')
          ),
          'dislikeCount',
        ],
      ],
      group: ['reviewId'],
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

  // 리뷰 수정
  updateReview = async (review, reviewId) => {
    return Reviews.update({ review }, { where: { reviewId } });
  };

  // 리뷰 삭제
  deleteReview = async (reviewId) => {
    return Reviews.destroy({ where: { reviewId } });
  };

  // 마이페이지에서 리뷰 조회
  findMyReview = async (data) => {
    return Reviews.findAll(data);
  };

  findOneReview = async (reviewId) => {
    return Reviews.findOne({
      raw: true,
      where: { reviewId },
      include: [
        {
          model: Users,
          attributes: ['nickname'],
        },
        {
          model: Likes,
          as: 'Likes',
          attributes: [],
          duplicating: false,
          required: false,
        },
        {
          model: Dislikes,
          as: 'Dislikes',
          attributes: [],
          duplicating: false,
          required: false,
        },
      ],
      attributes: [
        'reviewId',
        'medicineId',
        'review',
        'updatedAt',
        [
          Likes.sequelize.fn('count', Likes.sequelize.col('Likes.reviewId')),
          'likeCount',
        ],
        [
          Dislikes.sequelize.fn(
            'count',
            Dislikes.sequelize.col('Dislikes.reviewId')
          ),
          'dislikeCount',
        ],
      ],
      group: ['reviewId'],
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
}

module.exports = ReviewRepository;

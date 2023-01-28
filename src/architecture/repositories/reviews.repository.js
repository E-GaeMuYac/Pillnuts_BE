const { Op } = require('sequelize');
const { Reviews, Users, Likes, Dislikes, Medicines } = require('../../models');

class ReviewRepository {
  // 리뷰 작성
  createReview = async (medicineId, userId, review) => {
    await Reviews.create({ medicineId, userId, review });
  };

  // 리뷰 조회

  findReview = async (page, pageSize, data) => {
    return Reviews.findAndCountAll({
      raw: true,
      where: data,
      include: [
        {
          model: Users,
          attributes: ['nickname'],
          required: true,
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
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * pageSize,
      limit: Number(pageSize),
    });
  };

  findOneReview = async (reviewId) => {
    return Reviews.findOne({
      raw: true,
      where: { reviewId },
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
  findMyReview = async (userId, page, pageSize) => {
    return Reviews.findAndCountAll({
      raw: true,
      where: { userId },
      include: [
        {
          model: Medicines,
          attributes: [
            'medicineId',
            'itemName',
            'entpName',
            'etcOtcCode',
            'productType',
            'itemImage',
          ],
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
      order: [['createdAt', 'DESC']],
      offset: (page - 1) * pageSize,
      limit: Number(pageSize),
    });
  };

  findOneMyReview = async (reviewId) => {
    return Reviews.findOne({
      raw: true,
      where: { reviewId },
    });
  };

  // 리뷰 (도움 돼요)
  checkReviewLike = async (reviewId, userId) => {
    return Likes.findOne({
      where: {
        [Op.and]: [{ reviewId }, { userId }],
      },
    });
  };

  createLike = async (reviewId, userId) => {
    return Likes.create({
      reviewId,
      userId,
    });
  };

  deleteLike = async (reviewId, userId) => {
    return Likes.destroy({
      where: {
        [Op.and]: [{ reviewId }, { userId }],
      },
    });
  };

  // 리뷰 (도움 안돼요)
  checkReviewDislike = async (reviewId, userId) => {
    return Dislikes.findOne({
      where: {
        [Op.and]: [{ reviewId }, { userId }],
      },
    });
  };

  createDislike = async (reviewId, userId) => {
    return Dislikes.create({
      reviewId,
      userId,
    });
  };

  deleteDislike = async (reviewId, userId) => {
    return Dislikes.destroy({
      where: {
        [Op.and]: [{ reviewId }, { userId }],
      },
    });
  };
}

module.exports = ReviewRepository;

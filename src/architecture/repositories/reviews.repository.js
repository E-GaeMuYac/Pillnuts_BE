const { Op } = require('sequelize');
const { Reviews, Users, Likes, Dislikes, Medicines } = require('../../models');

class ReviewRepository {
  // 리뷰 작성
  createReview = async (medicineId, userId, review) => {
    await Reviews.create({ medicineId, userId, review });
  };

  // 리뷰 조회
  findReview = async (page, pageSize, data, order) => {
    return Reviews.findAndCountAll({
      raw: true,
      where: data,
      include: {
        model: Users,
        attributes: ['nickname', 'imageUrl'],
        required: true,
      },
      attributes: ['reviewId', 'userId', 'medicineId', 'review', 'updatedAt'],
      group: ['reviewId'],
      order: order,
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

  findLike = async (data) => {
    return Likes.findAll({
      raw: true,
      where: data,
      attributes: ['userId'],
    });
  };

  findDislike = async (data) => {
    return Dislikes.findAll({
      raw: true,
      where: data,
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
      ],
      attributes: [
        'reviewId',
        'userId',
        'medicineId',
        'review',
        'report',
        'updatedAt',
      ],
      group: ['userId'],
      order: [['updatedAt', 'DESC']],
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

  // 리뷰 (신고하기)
  checkReviewReport = async (reviewId) => {
    return Reviews.findOne({
      where: {
        reviewId,
      },
    });
  };

  createReport = async (reviewId, report) => {
    return Reviews.update({ report }, { where: { reviewId } });
  };
}

module.exports = ReviewRepository;

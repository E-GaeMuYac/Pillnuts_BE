const { Op } = require('sequelize');
const ReviewRepository = require('../repositories/reviews.repository');
const {
  InvalidParamsError,
} = require('../../middlewares/exceptions/error.class');

class ReviewService {
  constructor() {
    this.reviewRepository = new ReviewRepository();
  }

  // 리뷰 작성
  createReview = async (medicineId, userId, review) => {
    await this.reviewRepository.createReview(medicineId, userId, review);
  };

  // 리뷰 조회
  findReview = async (medicineId, page, pageSize, tag, order, loginUserId) => {
    let data = { medicineId, review: { [Op.like]: `%${tag}%` } };
    if (!tag) {
      data = { medicineId };
    }
    if (order === 'updatedAt') {
      order = [['updatedAt', 'DESC']];
    } else if (order === 'likeCount') {
      order = [['likeCount', 'DESC']];
    }

    const reviews = await this.reviewRepository.findReview(
      page,
      pageSize,
      data,
      order
    );

    const totalReview = reviews.count.length;
    const reviewList = await Promise.all(
      reviews.rows.map(async (review) => {
        let like = await this.reviewRepository.findLike(
          review.reviewId,
          loginUserId
        );

        let dislike = await this.reviewRepository.findDislike(
          review.reviewId,
          loginUserId
        );
        let likeValue = false;
        let dislikeValue = false;
        if (like) {
          likeValue = true;
        }
        if (dislike) {
          dislikeValue = true;
        }
        return {
          reviewId: review.reviewId,
          userId: review.userId,
          like: likeValue,
          dislike: dislikeValue,
          likeCount: review.likeCount,
          dislikeCount: review.dislikeCount,
          medicineId: review.medicineId,
          report: review.report,
          review: review.review,
          updatedAt: review.updatedAt,
          nickname: review['User.nickname'],
          userImage: review['User.imageUrl'],
        };
      })
    );
    return { totalReview, reviewList };
  };

  // 리뷰 수정
  updateReview = async (reviewId, review, userId) => {
    const changeReview = await this.reviewRepository.findOneReview(
      reviewId,
      userId
    );

    if (!changeReview) {
      throw new InvalidParamsError('리뷰를 찾을 수 없습니다.', 404);
    }

    if (userId !== changeReview.userId) {
      throw new InvalidParamsError('유저 권한이 없습니다.', 401);
    }
    await this.reviewRepository.updateReview(review, reviewId);
    return this.reviewRepository.findOneReview(reviewId);
  };

  // 리뷰 삭제
  deleteReview = async (reviewId, userId) => {
    const delReview = await this.reviewRepository.findOneReview(reviewId);

    if (delReview == null) {
      throw new InvalidParamsError('리뷰를 찾을 수 없습니다.', 404);
    }
    if (userId !== delReview.userId) {
      throw new InvalidParamsError('유저 권한이 없습니다.', 401);
    }
    await this.reviewRepository.deleteReview(reviewId);
  };

  // 마이페이지에서 리뷰 조회
  findMyReview = async (userId, page, pageSize) => {
    const reviews = await this.reviewRepository.findMyReview(
      userId,
      page,
      pageSize
    );

    const totalReview = reviews.count.length;
    const reviewList = await Promise.all(
      reviews.rows.map(async (review) => {
        let like = await this.reviewRepository.findLike(
          review.reviewId,
          userId
        );

        let dislike = await this.reviewRepository.findDislike(
          review.reviewId,
          userId
        );
        let likeValue = false;
        let dislikeValue = false;
        if (like) {
          likeValue = true;
        }
        if (dislike) {
          dislikeValue = true;
        }

        return {
          reviewId: review.reviewId,
          userId: review.userId,
          like: likeValue,
          dislike: dislikeValue,
          likeCount: review.likeCount,
          dislikeCount: review.dislikeCount,
          medicineId: review.medicineId,
          review: review.review,
          updatedAt: review.updatedAt,
          nickname: review['User.nickname'],
          medicineId: review['Medicine.medicineId'],
          itemName: review['Medicine.itemName'].split('(')[0],
          entpName: review['Medicine.entpName'],
          etcOtcCode: review['Medicine.etcOtcCode'],
          productType: review['Medicine.productType'].split('.'),
          itemImage: review['Medicine.itemImage'],
        };
      })
    );
    return { totalReview, reviewList };
  };

  // 리뷰 (도움 돼요)
  checkReviewLike = async (reviewId, userId) => {
    const isLike = await this.reviewRepository.checkReviewLike(
      reviewId,
      userId
    );

    if (!isLike) {
      await this.reviewRepository.deleteDislike(reviewId, userId);
      return this.reviewRepository.createLike(reviewId, userId);
    } else {
      await this.reviewRepository.deleteLike(reviewId, userId);
    }
  };

  // 리뷰 (도움 안돼요)
  checkReviewDislike = async (reviewId, userId) => {
    const isDislike = await this.reviewRepository.checkReviewDislike(
      reviewId,
      userId
    );

    if (!isDislike) {
      await this.reviewRepository.deleteLike(reviewId, userId);
      return this.reviewRepository.createDislike(reviewId, userId);
    } else {
      await this.reviewRepository.deleteDislike(reviewId, userId);
    }
  };

  // 리뷰 (신고하기)
  checkReviewReport = async (reviewId, userId) => {
    const isReported = await this.reviewRepository.checkReviewReport(reviewId);
    if (isReported.report === null) {
      let report = `${userId}`;
      await this.reviewRepository.createReport(reviewId, report);
    } else if (isReported.report.split(',').indexOf(`${userId}`) === -1) {
      let report = `${isReported.report},${userId}`;
      await this.reviewRepository.createReport(reviewId, report);
    } else {
      return '이미 신고한 리뷰입니다';
    }
  };
}

module.exports = ReviewService;

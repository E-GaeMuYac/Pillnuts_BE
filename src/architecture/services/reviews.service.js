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
    if (order === 'createdAt') {
      order = [['createdAt', 'DESC']];
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
        let like = await this.reviewRepository.findLike({
          reviewId: review.reviewId,
        });

        let dislike = await this.reviewRepository.findDislike({
          reviewId: review.reviewId,
        });

        let likeValue =
          like.findIndex((l) => l.userId == loginUserId) == -1 ? false : true;
        let dislikeValue =
          dislike.findIndex((l) => l.userId == loginUserId) == -1
            ? false
            : true;

        let report = [];

        if (review.report && review.report.length > 1)
          report = review.report.split(',');

        return {
          reviewId: review.reviewId,
          userId: review.userId,
          like: likeValue,
          dislike: dislikeValue,
          likeCount: like.length,
          dislikeCount: dislike.length,
          medicineId: review.medicineId,
          report: report,
          review: review.review,
          createdAt: review.createdAt,
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
        let like = await this.reviewRepository.findLike({
          reviewId: review.reviewId,
        });

        let dislike = await this.reviewRepository.findDislike({
          reviewId: review.reviewId,
        });

        let likeValue =
          like.findIndex((l) => l.userId == userId) == -1 ? false : true;
        let dislikeValue =
          dislike.findIndex((l) => l.userId == userId) == -1 ? false : true;

        let report = [];

        if (review.report && review.report.length > 1)
          report = review.report.split(',');

        return {
          reviewId: review.reviewId,
          userId: review.userId,
          like: likeValue,
          dislike: dislikeValue,
          likeCount: like.length,
          dislikeCount: dislike.length,
          medicineId: review.medicineId,
          review: review.review,
          report: report,
          createdAt: review.createdAt,
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
      const a = await this.reviewRepository.deleteLike(reviewId, userId);
      return this.reviewRepository.createDislike(reviewId, userId);
    } else {
      await this.reviewRepository.deleteDislike(reviewId, userId);
    }
  };

  // 리뷰 (신고하기)
  checkReviewReport = async (reviewId, userId) => {
    const isReported = await this.reviewRepository.findOneReview(reviewId);
    let report = isReported.report;
    if (!report) {
      report = userId;
      await this.reviewRepository.createReport(reviewId, report);
      return { status: 201, message: '신고하기 성공' };
    } else if (isReported.report.split(',').indexOf(`${userId}`) === -1) {
      report += ',' + userId;
      await this.reviewRepository.createReport(reviewId, report);
      return { status: 201, message: '신고하기 성공' };
    } else {
      return { status: 200, message: '이미 신고한 리뷰입니다' };
    }
  };
}

module.exports = ReviewService;

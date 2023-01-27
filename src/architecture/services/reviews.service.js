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
  findReview = async (medicineId, page, pageSize, loginUserId) => {
    const reviews = await this.reviewRepository.findReview(
      medicineId,
      page,
      pageSize,
      loginUserId
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
          review: review.review,
          updatedAt: review.updatedAt,
          nickname: review['User.nickname'],
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
        let like = await this.reviewRepository.checkReviewLike(
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
      await this.reviewRepository.createLike(reviewId, userId);
      await this.reviewRepository.deleteDislike(reviewId, userId);
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
}

module.exports = ReviewService;

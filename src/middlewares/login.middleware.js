require('dotenv').config();
const { validateRefreshToken } = require('../util/token');
const {
  AuthenticationError,
} = require('../middlewares/exceptions/error.class');

// 로그인이 되어있는 유저일 경우, Error를 반환한다.
module.exports = (req, res, next) => {
  try {
    if (!req.headers.refreshtoken) {
      next();
      return;
    }
    const isRefreshTokenValidate = validateRefreshToken(
      req.headers.refreshtoken
    );

    if (isRefreshTokenValidate) {
      throw new AuthenticationError('이미 로그인이 되어있습니다.', 403);
    }
    next();
  } catch (error) {
    next(error);
  }
};

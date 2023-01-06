const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('./exceptions/error.class');

module.exports = async (req, res, next) => {
  try {
    // 토큰이 없을 경우
    const accessToken = req.headers.accesstoken;

    if (!accessToken) {
      throw new AuthenticationError('accessToken이 없습니다.', 404);
    }

    // validateAccessToken() = 엑세스 토큰 확인
    const isAccessTokenValidate = validateAccessToken(accessToken);

    // AccessToken을 확인 했을 때 만료일 경우
    if (!isAccessTokenValidate) {
      throw new AuthenticationError('accessToken이 만료되었습니다.', 404);
    }

    const { userId } = getAccessTokenPayload(accessToken);
    res.locals.userId = userId;

    next();
  } catch (err) {
    console.log(err);
    return res.status(400).json({ msg: '로그인이 필요합니다.' });
  }
};

// Access Token을 검증합니다.
function validateAccessToken(accessToken) {
  try {
    jwt.verify(accessToken, process.env.SECRET_KEY); // JWT를 검증합니다.
    return true;
  } catch (error) {
    return false;
  }
}

// Access Token의 Payload를 가져옵니다.
function getAccessTokenPayload(accessToken) {
  try {
    return jwt.verify(accessToken, process.env.SECRET_KEY);
  } catch (error) {
    return null;
  }
}

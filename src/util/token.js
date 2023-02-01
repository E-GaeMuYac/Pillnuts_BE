const jwt = require('jsonwebtoken');

require('dotenv').config();

createAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.SECRET_KEY, { expiresIn: '30s' });
};

createRefreshToken = () => {
  return jwt.sign({}, process.env.SECRET_KEY, { expiresIn: '2m' });
};

// Refresh Token을 검증한다.
validateRefreshToken = (refreshtoken) => {
  try {
    jwt.verify(refreshtoken, process.env.SECRET_KEY);
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = {
  createAccessToken,
  createRefreshToken,
  validateRefreshToken,
};

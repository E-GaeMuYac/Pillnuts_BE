const { validateRefreshToken } = require('../util/token');
const { Users } = require('../models');

module.exports = async (req, res, next) => {
  try {
    const refreshToken = req.headers.refreshtoken;
    if (!refreshToken) {
      res.locals.userId = null;
    } else {
      const isRefreshTokenValidate = validateRefreshToken(refreshToken);
      if (!isRefreshTokenValidate) {
        res.locals.userId = null;
      } else {
        const user = await Users.findOne({
          raw: true,
          where: { refreshToken },
        });
        if (user) {
          res.locals.userId = user.userId;
        } else {
          res.locals.userId = null;
        }
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};

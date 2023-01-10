const passport = require('passport');
const google = require('./GoogleStrategy');
const { Users } = require('../models');

module.exports = () => {
  google(); // 구글 등록

  passport.serializeUser((user, done) => {
    done(null, user[2].userId);
  });

  passport.deserializeUser((userId, done) => {
    if (userId)
      return done(
        null,
        Users.findOne({
          where: { userId },
        })
      );
    done(null, false);
  });
};

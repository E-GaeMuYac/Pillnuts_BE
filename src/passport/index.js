const passport = require('passport');
const google = require('./GoogleStrategy');
const { Users } = require('../models');

module.exports = () => {
  google(); // 구글 등록

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((userId, done) => {
    if (userId)
      return done(
        null,
        Users.findOne({
          where: { userId },
        })
      );
  });
};

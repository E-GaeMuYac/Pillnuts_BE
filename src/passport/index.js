const passport = require('passport');
const google = require('./GoogleStrategy');

module.exports = () => {
  google(); // 구글 등록

  passport.serializeUser((user, done) => {
    
    done(null, user);
  });

  passport.deserializeUser((id, done) => {
    console.log('user', id)
    if (id) return done(null, id);
    done(null, false);
  });
};

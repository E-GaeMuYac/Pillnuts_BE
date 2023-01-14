const passport = require('passport');
const google = require('./GoogleStrategy');
const naver = require('./NaverStrategy');
const kakao = require('./KakaoStrategy');

module.exports = () => {
  google(); // 구글 등록
  naver(); // 네이버 등록
  kakao(); // 카카오 등록

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser(async (user, done) => {
    if (user) return done(null, user);
  });
};

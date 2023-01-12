const passport = require('passport');
const Naver = require('passport-naver-v2');
const { Users } = require('../models');
const { createAccessToken, createRefreshToken } = require('../util/token');
const {
  AuthenticationError,
} = require('../middlewares/exceptions/error.class');

const NaverStrategy = Naver.Strategy;

require('dotenv').config();

module.exports = () => {
  passport.use(
    new NaverStrategy(
      {
        clientID: process.env.NAVER_CLIENT_ID,
        clientSecret: process.env.NAVER_CLIENT_SECRET,
        callbackURL: process.env.NAVER_CALLBACK_URL,
        passReqToCallback: true,
      },
      async (request, accessToken, refreshToken, profile, done) => {
        try {
          // 이미 로컬 로그인에서 가입된 이메일이면
          const LocalExUser = await Users.findOne({
            where: {
              email,
            },
            raw: true,
          });
          if (LocalExUser) {
            throw new AuthenticationError('이미 로그인이 되어있습니다.', 403);
          }

          // 네이버 플랫폼에서 로그인 했고 & 소셜 로그인 한 경우
          const NaverExUser = await Users.findOne({
            where: {
              email: profile._json.response.email,
            },
            raw: true,
          });
          const refreshtoken = await createRefreshToken();

          // 이미 가입된 네이버 프로필이면, 로그인 인증 완료
          if (NaverExUser) {
            await Users.update(
              // refresh token을 update해줌
              { refreshtoken },
              { where: { userId: NaverExUser.userId } }
            );
            const accesstoken = await createAccessToken(NaverExUser.userId);
            done(null, [accesstoken, refreshtoken, NaverExUser]);
          } else {
            let nickname = profile._json.response.nickname;
            if (!nickname) {
              nickname = profile._json.response.email.split('@')[0];
            }
            // 가입되지 않은 유저면, 회원가입 시키고 로그인 시킨다.
            const NaverNewUser = await Users.create({
              email: profile._json.response.email,
              refreshtoken,
              imageUrl: profile._json.response.email,
              nickname,
            });

            const accesstoken = await createAccessToken(NaverNewUser.userId);
            done(null, [accesstoken, refreshtoken]); // 회원가입하고 로그인 인증 완료
          }
        } catch (error) {
          done(error);
        }
      }
    )
  );
};

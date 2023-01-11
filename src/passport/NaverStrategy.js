const passport = require('passport');
const Naver = require('passport-naver-v2');
const { Users } = require('../models');
const { createAccessToken, createRefreshToken } = require('../util/token');

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
          // 네이버 플랫폼에서 로그인 했고 & 소셜 로그인 한 경우
          const exUser = await Users.findOne({
            where: {
              email: profile._json.response.email,
            },
            raw: true,
          });
          const refreshtoken = await createRefreshToken();

          // 이미 가입된 네이버 프로필이면, 로그인 인증 완료
          if (exUser) {
            await Users.update(
              // refresh token을 update해줌
              { refreshtoken },
              { where: { userId: exUser.userId } }
            );
            const accesstoken = await createAccessToken(exUser.userId);
            done(null, [accesstoken, refreshtoken, exUser]);
          } else {
            let nickname = profile._json.response.nickname;
            if (!nickname) {
              nickname = profile._json.response.email.split('@')[0];
            }
            // 가입되지 않은 유저면, 회원가입 시키고 로그인 시킨다.
            const newUser = await Users.create({
              email: profile._json.response.email,
              refreshtoken,
              nickname: nickname,
            });

            const accesstoken = await createAccessToken(newUser.userId);
            done(null, [accesstoken, refreshtoken]); // 회원가입하고 로그인 인증 완료
          }
        } catch (error) {
          done(error);
        }
      }
    )
  );
};

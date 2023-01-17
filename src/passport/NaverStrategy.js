const passport = require('passport');
const Naver = require('passport-naver-v2');
const { Users } = require('../models');
const { createAccessToken, createRefreshToken } = require('../util/token');
const { ExistError } = require('../middlewares/exceptions/error.class');
const formatDate = require('../util/formatDate');

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
          const NaverExUser = await Users.findOne({
            where: {
              email: profile._json.response.email,
              loginType: 'Naver',
            },
            raw: true,
          });
          const refreshtoken = await createRefreshToken();
          const today = formatDate(new Date());

          // 이미 가입된 네이버 프로필이면, 로그인 인증 완료
          if (NaverExUser) {
            const loginCount = NaverExUser.loginCount;
            const existLogin = loginCount.filter((day) => day == today);
            if (!existLogin.length) {
              loginCount.push(today);
            }
            await Users.update(
              // refresh token을 update해줌
              { refreshtoken, loginCount },
              { where: { userId: NaverExUser.userId } }
            );
            const accesstoken = await createAccessToken(NaverExUser.userId);
            done(null, [accesstoken, refreshtoken, NaverExUser.nickname]);
          } else if (!NaverExUser) {
            // 로컬 로그인과 이메일 중복체크
            const LocalExUser = await Users.findOne({
              raw: true,
              where: { email: profile._json.response.email },
            });
            if (LocalExUser) {
              throw new ExistError('이미 존재하는 이메일입니다.');
            }

            let nickname = profile._json.response.nickname;
            if (!nickname) {
              nickname = profile._json.response.email.split('@')[0];
            }
            let imageUrl = profile.profileImage;
            const basicImage =
              'https://ssl.pstatic.net/static/pwe/address/img_profile.png';
            if (imageUrl === basicImage || !imageUrl) {
              const filename = `icon${Math.floor(Math.random() * 5)}.png`;
              imageUrl = `${process.env.ICON_URL}${filename}`;
            }

            // 가입되지 않은 유저면, 회원가입 시키고 로그인 시킨다.

            const NaverNewUser = await Users.create({
              email: profile._json.response.email,
              refreshtoken,
              imageUrl,
              nickname,
              loginType: 'Naver',
              loginCount: [today],
            });

            const accesstoken = await createAccessToken(NaverNewUser.userId);
            done(null, [accesstoken, refreshtoken, nickname]); // 회원가입하고 로그인 인증 완료
          }
        } catch (error) {
          done(error);
        }
      }
    )
  );
};

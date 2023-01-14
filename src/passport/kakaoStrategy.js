const passport = require('passport');
const Kakao = require('passport-kakao');
const { ExistError } = require('../middlewares/exceptions/error.class');
const { Users } = require('../models');
const { createAccessToken, createRefreshToken } = require('../util/token');

const KakaoStrategy = Kakao.Strategy;

require('dotenv').config();

module.exports = () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_CLIENT_ID,
        clientSecret: process.env.KAKAO_CLIENT_SECRET,
        callbackURL: process.env.KAKAO_CALLBACK_URL,
        passReqToCallback: true,
      },

      async (request, accessToken, refreshToken, profile, done) => {
        try {
          // 카카오 플랫폼에서 로그인 했었고 & 소셜 로그인 한 경우
          const KakaoExUser = await Users.findOne({
            raw: true,
            where: {
              email: profile._json.kakao_account.email,
              loginType: 'Kakao',
            },
          });
          const today = formatDate(new Date());
          const refreshtoken = await createRefreshToken();

          // 이미 가입된 카카오 프로필이면, 로그인 인증 완료
          if (KakaoExUser) {
            const loginCount = GoogleExUser.loginCount;
            const existLogin = loginCount.filter((day) => day == today);
            if (!existLogin.length) {
              loginCount.push(today);
            }
            await Users.update(
              { refreshtoken, loginCount }, // refresh token을 update해줌
              { where: { userId: KakaoExUser.userId } }
            );

            const accesstoken = await createAccessToken(KakaoExUser.userId);
            done(null, [accesstoken, refreshtoken, KakaoExUser.nickname]);
          } else if (!KakaoExUser) {
            // 로컬 로그인과 이메일 중복체크
            const LocalExUser = await Users.findOne({
              raw: true,
              where: {
                email: profile._json.kakao_account.email,
              },
            });
            if (LocalExUser) {
              throw new ExistError('이미 존재하는 이메일입니다.');
            }

            let { nickname } = profile._json.kakao_account.profile;
            if (!nickname) {
              nickname = profile._json.kakao_account.email.split('@')[0];
            }

            // 가입되지 않은 유저면, 회원가입 시키고 로그인 시킨다.
            const KakaoNewUser = await Users.create({
              email: profile._json.kakao_account.email,
              refreshtoken,
              imageUrl: profile._json.kakao_account.profile.thumbnail_image_url,
              nickname,
              loginType: 'Kakao',
              loginCount: [today],
            });

            const accesstoken = await createAccessToken(KakaoNewUser.userId);

            done(null, [accesstoken, refreshtoken, nickname]); // 회원가입하고 로그인 인증 완료
          }
        } catch (error) {
          done(error);
        }
      }
    )
  );
};

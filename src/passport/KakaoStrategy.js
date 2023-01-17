const passport = require('passport');
const Kakao = require('passport-kakao');
const { ExistError } = require('../middlewares/exceptions/error.class');
const { Users } = require('../models');
const { createAccessToken, createRefreshToken } = require('../util/token');
const formatDate = require('../util/formatDate');

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
          const url = profile._json.kakao_account;
          const KakaoExUser = await Users.findOne({
            raw: true,
            where: {
              email: url.email,
              loginType: 'Kakao',
            },
          });
          const today = formatDate(new Date());
          const refreshtoken = await createRefreshToken();

          // 이미 가입된 카카오 프로필이면, 로그인 인증 완료
          if (KakaoExUser) {
            const loginCount = KakaoExUser.loginCount;
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
          }
          let { nickname } = url.profile;
          if (!nickname) {
            nickname = url.email.split('@')[0];
          }

          let imageUrl = url.profile.thumbnail_image_url;
          const basicImage =
            'http://k.kakaocdn.net/dn/dpk9l1/btqmGhA2lKL/Oz0wDuJn1YV2DIn92f6DVK/img_110x110.jpg';
          if (imageUrl === basicImage || !imageUrl) {
            const filename = `icon${Math.floor(Math.random() * 5)}.png`;
            imageUrl = `${process.env.ICON_URL}${filename}`;
          }

          // 가입되지 않은 유저면, 회원가입 시키고 로그인 시킨다.
          const KakaoNewUser = await Users.create({
            email: url.email,
            refreshtoken,
            imageUrl,
            nickname,
            loginType: 'Kakao',
            loginCount: [today],
          });

          const accesstoken = await createAccessToken(KakaoNewUser.userId);

          done(null, [accesstoken, refreshtoken, nickname]); // 회원가입하고 로그인 인증 완료
        } catch (error) {
          done(error);
        }
      }
    )
  );
};

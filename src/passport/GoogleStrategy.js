const passport = require('passport');
const Google = require('passport-google-oauth2');
const { ExistError } = require('../middlewares/exceptions/error.class');
const { Users } = require('../models');
const { createAccessToken, createRefreshToken } = require('../util/token');
const formatDate = require('../util/formatDate');

const GoogleStrategy = Google.Strategy;

require('dotenv').config();

module.exports = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        passReqToCallback: true,
      },

      async (request, accessToken, refreshToken, profile, done) => {
        try {
          // 구글 플랫폼에서 로그인 했었고 & 소셜 로그인 한 경우
          const GoogleExUser = await Users.findOne({
            raw: true,
            where: {
              email: profile._json.email,
              loginType: 'Google',
            },
          });

          const refreshtoken = await createRefreshToken();
          const today = formatDate(new Date());

          // 이미 가입된 구글 프로필이면, 로그인 인증 완료
          if (GoogleExUser) {
            const loginCount = GoogleExUser.loginCount;
            const existLogin = loginCount.filter((day) => day == today);

            if (!existLogin.length) {
              loginCount.push(today);
            }
            await Users.update(
              { refreshtoken, loginCount }, // refresh token을 update해줌
              { where: { userId: GoogleExUser.userId } }
            );

            const accesstoken = await createAccessToken(GoogleExUser.userId);
            done(null, [accesstoken, refreshtoken, GoogleExUser.nickname]);
          }
          let nickname = profile._json.nickname;
          if (!nickname) {
            nickname = profile._json.email.split('@')[0];
          }

          let imageUrl = profile._json.picture;
          const basicImage =
            'https://lh3.googleusercontent.com/a/default-user=s96-c';
          if (imageUrl === basicImage || !imageUrl) {
            const filename = `icon${Math.floor(Math.random() * 5)}.png`;
            imageUrl = `${process.env.ICON_URL}${filename}`;
          }
          // 가입되지 않은 유저면, 회원가입 시키고 로그인 시킨다.
          const GoogleNewUser = await Users.create({
            email: profile._json.email,
            refreshtoken,
            imageUrl,
            nickname,
            loginType: 'Google',
            loginCount: [today],
          });
          const accesstoken = await createAccessToken(GoogleNewUser.userId);

          done(null, [accesstoken, refreshtoken, nickname]); // 회원가입하고 로그인 인증 완료
        } catch (error) {
          done(error);
        }
      }
    )
  );
};

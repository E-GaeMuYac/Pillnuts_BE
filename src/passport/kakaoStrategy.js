// const passport = require('passport');
// const kakaoStrategy = require('passport-kakao').Strategy;

// const User = require('../models/users');

// module.exports = () => {
//     passport.use(
//         new kakaoStrategy(
//     {
//     clientID: process.env.KAKAO_ID,
//     callbackURL: '/api/users/login/kakao',
//     }, 

// async(accessToken, refreshToken, profile, done) => {
// try {
//     const exUser = await User.findOne({ // DB에서 가입이력 조사
//         where: { email },
//     });
//     if (exUser) { // 로그인 성공했다면,
//         done(null, exUser);
//     } else { // 가입 이력이 없으면, 곧바로 회원가입 시키고 로그인 성공
//         const newUser = await User.create({
//             email: profile._json && profile._json.kaccount_email,
//             nick: profile.displayName,
//             snsId: profile.id,
//             provider: 'kakao',
//         });
//         done(null, newUser);
//     }
//     } catch (error) { // 로그인 실패
//         console.error(error);
//         done(error);
//     }
// }));
// };

const express = require('express');
const router = express.Router();

const loginMiddleware = require('../middlewares/login.middleware');
const LoginController = require('../architecture/controllers/login.controller');
const loginController = new LoginController

// Login
router.post('/normal', loginController.Login);

// kakao Login
// router.get('/kakao', passport.authenticate('kakao')); // /kakao요청이 서버로 오면, 카카오 로그인 페이지로 이동하고, 카카오 서버를 통해 카카오 로그인을 하게 되면, 다음 라우터로 요청한다.

// // 위에서 카카오 서버 로그인이 되면, 카카오 redirect url 설정에 따라 이쪽 라우터로 오게된다.
// router.get('/kakao', passport.authenticate('kakao', { // 그리고 passport 로그인 전략에 의해 kakaoStrategy로 가서 카카오계정 정보와 DB를 비교해서 회원가입시키거나 로그인 처리하게 한다.
// failureRedirect: '/', // kakaoStrategy에서 실패한다면 실행
// }), 
// (req, res) => { // kakaoStrategy에서 성공한다면 콜백 실행
//     res.redirect('/');
// },
// );


module.exports = router;

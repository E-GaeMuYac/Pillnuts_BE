const passport = require('passport');
const { ValidationError } = require('../../middlewares/exceptions/error.class');
require('dotenv').config();
const Validation = require('../../util/joi');
const Joi = require('joi');

const LoginService = require('../services/login.service');

class LoginController {
  loginService = new LoginService();
  validation = new Validation();

  Login = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const result = Joi.object()
        .keys({
          email: this.validation.getEmailJoi(),
          password: this.validation.getPasswordJoi(),
        })
        .validate(req.body);

      if (result.error) {
        throw new ValidationError(result.error.details[0].message);
      }

      const { accesstoken, refreshtoken, existUser } =
        await this.loginService.existUser(email, password);

      return res.header({ accesstoken, refreshtoken }).status(201).json({
        nickname: existUser.nickname,
        msg: '로그인에 성공하였습니다.',
      });
    } catch (error) {
      next(error);
    }
  };

  google = passport.authenticate('google', { scope: ['email'] });

  googleCallback = passport.authenticate('google', {
    successRedirect: '/api/users/login', // GoogleStrategy에서 성공한다면 이 주소로 이동
    failureRedirect: '/api/users/login/google/callback', // GoogleStrategy에서 실패하면 이 주소로 이동
  });

  naver = passport.authenticate('naver', { scope: ['email'] });

  naverCallback = passport.authenticate('naver', {
    successRedirect: '/api/users/login', // NaverStrategy에서 성공한다면 이 주소로 이동
    failureRedirect: '/api/users/login/naver/callback', // NaverStrategy에서 실패하면 이 주소로 이동
  });

  kakao = passport.authenticate('kakao', {
    scope: ['account_email', 'profile_nickname', 'profile_image'],
  });

  kakaoCallback = passport.authenticate('kakao', {
    successRedirect: '/api/users/login', // KakaoStrategy에서 성공한다면 이 주소로 이동
    failureRedirect: '/api/users/login/kakao/callback', // KakaoStrategy에서 실패하면 이 주소로 이동
  });

  responseToken = (req, res) => {
    const accesstoken = req.user[0];
    const refreshtoken = req.user[1];
    const nickname = req.user[2];
    res.redirect(
      `https://www.pillnuts.store/login/loading?accesstoken=${accesstoken}&refreshtoken=${refreshtoken}&nickname=${nickname}`
    );
    return;
  };
}

module.exports = LoginController;

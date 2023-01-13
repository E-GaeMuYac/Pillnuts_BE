const passport = require('passport');
const { ValidationError } = require('../../middlewares/exceptions/error.class');
require('dotenv').config({ path: '../.env' });
const Joi = require('joi');

const LoginService = require('../services/login.service');

class LoginController {
  loginService = new LoginService();

  Login = async (req, res, next) => {
    try {
      const { email, password } = req.body; // 1. email, password를 바디값에 넣어준다.

      // 1-1. 이메일 형태가 맞지 않을 경우 -> validationError(412)를 띄운다.
      const schema = Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string()
          .required()
          .pattern(new RegExp('^[a-zA-Z]+[0-9]+$'))
          .min(8)
          .max(15),
      });
      const result = schema.validate(req.body);

      if (result.error) {
        throw new ValidationError('데이터 형식이 잘못되었습니다.', 412);
      }

      const { accesstoken, refreshtoken, existUser } =
        await this.loginService.existUser(email, password); // 2. Users에 ExistUser의 email이 있는지 찾아본다.

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
    successRedirect: '/', // NaverStrategy에서 성공한다면 이 주소로 이동
    failureRedirect: '/api/users/login/naver/callback', // NaverStrategy에서 실패하면 이 주소로 이동
  });

  responseToken = (req, res) => {
    const accesstoken = req.user[0];
    const refreshtoken = req.user[1];
    const nickname = req.user[2];
    res.header({ accesstoken, refreshtoken }).status(201).json({
      nickname,
    });
  };
}

module.exports = LoginController;

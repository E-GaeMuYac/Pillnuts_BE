const UsersService = require('../services/users.service');
const url = require('url');
const Joi = require('joi');

class UsersController {
  constructor() {
    this.usersService = new UsersService();
  }
  signUp = async (req, res, next) => {
    try {
      const schema = Joi.object().keys({
        email: Joi.string().email().required(),
        nickname: Joi.string(),
        password: Joi.string()
          .pattern(new RegExp('^[a-zA-Z]+[0-9]+$'))
          .min(8)
          .max(15),
        confirm: Joi.ref('password'),
      });
      const result = await schema.validate(req.body);
      console.log(result.error);
      if (result.error) {
        throw new Error('데이터 형식이 잘못되었습니다.');
      }
      const { email, password, nickname } = result.value;
      await this.usersService.signUp(email, password, nickname);

      return res.status(201).json({ message: '회원가입에 성공하였습니다.' });
    } catch (error) {
      next(error);
    }
  };

  duplicateCheck = async (req, res, next) => {
    try {
      const { email } = url.parse(req.url, true).query;
      const schema = Joi.string().email().required();
      const result = schema.validate(email);

      if (result.error) {
        throw new Error('데이터 형식이 잘못되었습니다.');
      }

      await this.usersService.duplicateCheck(email);

      return res.status(200).json({ message: '사용가능한 이메일입니다.' });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req, res, next) => {
    try {
      const userId = 19; //res.locals.user
      await this.usersService.logout(userId);

      return res.status(201).json({ message: '로그아웃이 완료되었습니다.' });
    } catch (error) {
      next(error);
    }
  };

  // updateUser = async (req, res, next) => {
  //   try {
  //     const userId = 19; //res.locals.user
  //   } catch (error) {
  //     next(error);
  //   }
  // };
}

module.exports = UsersController;

const UsersService = require('../services/users.service');
const url = require('url');
const Joi = require('joi');

const {
  ValidationError,
} = require('../../middlewares/exceptions/error.class.js');

class UsersController {
  constructor() {
    this.usersService = new UsersService();
  }
  signUp = async (req, res, next) => {
    try {
      const schema = Joi.object().keys({
        email: Joi.string().email().required(),
        phoneNumber: Joi.string()
          .length(11)
          .pattern(/^[0-9]+$/)
          .required(),
        nickname: Joi.string().required(),
        password: Joi.string()
          .required()
          .pattern(/^[a-zA-Z]+[0-9]+$/)
          .min(8)
          .max(15),
        confirm: Joi.string().required().valid(Joi.ref('password')),
      });

      const result = schema.validate(req.body);
      console.log(result.error);
      if (result.error) {
        throw new ValidationError('데이터 형식이 잘못되었습니다.');
      }

      const { email, password, nickname, phoneNumber } = req.body;
      await this.usersService.signUp(email, password, nickname, phoneNumber);
      return res.status(201).json({ message: '회원가입에 성공하였습니다' });
    } catch (error) {
      next(error);
    }
  };

  duplicateCheck = async (req, res, next) => {
    try {
      const { email } = url.parse(req.url, true).query;
      const result = Joi.string().email().required().validate(email);

      if (result.error) {
        throw new ValidationError('데이터 형식이 잘못되었습니다.');
      }

      await this.usersService.duplicateCheck(email);

      return res.status(200).json({ message: '사용가능한 이메일입니다.' });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req, res, next) => {
    try {
      const { userId } = res.locals;
      await this.usersService.logout(userId);

      return res.status(201).json({ message: '로그아웃이 완료되었습니다.' });
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req, res, next) => {
    try {
      const { userId } = res.locals;
      const schema = Joi.string().required();
      const { nickname, password, filename } = req.body;
      const result = schema.validate(nickname);
      if (result.error) {
        throw new ValidationError('데이터 형식이 잘못되었습니다.');
      }
      const presignedUrl = await this.usersService.updateUser(
        nickname,
        userId,
        password,
        filename
      );

      return res
        .status(201)
        .json({ message: '회원정보가 수정되었습니다', presignedUrl });
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req, res, next) => {
    try {
      const { userId } = res.locals;
      const { password } = req.body;

      await this.usersService.deleteUser(userId, password);

      return res.status(200).json({ message: '탈퇴가 완료되었습니다.' });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = UsersController;

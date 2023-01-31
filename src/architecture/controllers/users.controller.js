const UsersService = require('../services/users.service');
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
          .pattern(new RegExp(/^(?=.*[A-Za-z])(?=.*[0-9]).{8,15}$/)),
        confirm: Joi.string().required().valid(Joi.ref('password')),
      });

      const result = schema.validate(req.body);

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
      const { email } = req.query;
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

  authenticationEmail = async (req, res, next) => {
    try {
      const { email } = req.body;
      const result = Joi.string().email().required().validate(email);

      if (result.error) {
        throw new ValidationError('데이터 형식이 잘못되었습니다.');
      }
      const code = await this.usersService.authenticationEmail(email);
      return res.status(201).json(code);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  authenticationPhone = async (req, res, next) => {
    try {
      const { phoneNumber } = req.body;
      const result = Joi.string()
        .length(11)
        .pattern(/^[0-9]+$/)
        .required()
        .validate(phoneNumber);

      if (result.error) {
        throw new ValidationError('데이터 형식이 잘못되었습니다.');
      }
      const code = await this.usersService.authenticationPhone(phoneNumber);
      return res.status(201).json(code);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  findEmail = async (req, res, next) => {
    try {
      const { phoneNumber } = req.query;
      const email = await this.usersService.findEmail(phoneNumber);

      return res.status(200).json(email);
    } catch (error) {
      next(error);
    }
  };

  findPhoneNumber = async (req, res, next) => {
    try {
      const { email } = req.query;
      const phoneNumber = await this.usersService.findPhoneNumber(email);

      return res.status(200).json({ phoneNumber });
    } catch (error) {
      next(error);
    }
  };

  findPassword = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const result = Joi.string()
        .required()
        .pattern(new RegExp(/^(?=.*[A-Za-z])(?=.*[0-9]).{8,15}$/))
        .validate(password);
      if (result.error) {
        throw new ValidationError('데이터 형식이 잘못되었습니다.');
      }

      await this.usersService.findPassword(email, password);

      return res
        .status(200)
        .json({ message: '비밀번호가 정상적으로 변경되었습니다.' });
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

  findUser = async (req, res, next) => {
    try {
      const { userId } = res.locals;
      const user = await this.usersService.findUser(userId);

      return res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  };

  updateNickname = async (req, res, next) => {
    try {
      const { userId } = res.locals;
      const { nickname } = req.body;
      const result = Joi.string().required().validate(nickname);
      if (result.error) {
        throw new ValidationError('데이터 형식이 잘못되었습니다.');
      }
      await this.usersService.updateNickname(nickname, userId);

      return res.status(201).json({ message: '회원정보가 수정되었습니다' });
    } catch (error) {
      next(error);
    }
  };

  updateImg = async (req, res, next) => {
    try {
      const { userId } = res.locals;
      const { filename } = req.body;

      const presignedUrl = await this.usersService.updateImg(userId, filename);

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

const UsersService = require('../services/users.service');
const Joi = require('joi');
const Validation = require('../../util/joi');
const {
  ValidationError,
  AuthenticationError,
} = require('../../middlewares/exceptions/error.class.js');

class UsersController {
  constructor() {
    this.usersService = new UsersService();
    this.validation = new Validation();
  }
  signUp = async (req, res, next) => {
    try {
      const result = Joi.object()
        .keys({
          email: this.validation.getEmailJoi(),
          phoneNumber: this.validation.getPhoneNumberJoi(),
          nickname: this.validation.getNicknameJoi(),
          password: this.validation.getPasswordJoi(),
          confirm: this.validation.getConfirmJoi(),
        })
        .validate(req.body);
      // console.log(result.error.details[0].message);
      if (result.error) {
        throw new ValidationError(result.error.details[0].message);
      }

      const { email, password, nickname, phoneNumber, certification } =
        req.body;
      if (!certification) {
        throw new AuthenticationError('휴대폰 인증이 필요합니다');
      }
      await this.usersService.signUp(email, password, nickname, phoneNumber);
      return res.status(201).json({ message: '회원가입에 성공하였습니다' });
    } catch (error) {
      next(error);
    }
  };

  duplicateCheckEmail = async (req, res, next) => {
    try {
      const { email } = req.query;
      const result = Joi.object()
        .keys({
          email: this.validation.getEmailJoi(),
        })
        .validate(req.query);

      if (result.error) {
        throw new ValidationError(result.error.details[0].message);
      }

      await this.usersService.duplicateCheckEmail(email);

      return res.status(200).json({ message: '사용가능한 이메일입니다.' });
    } catch (error) {
      next(error);
    }
  };

  duplicateCheckPhone = async (req, res, next) => {
    try {
      console.log(req.query);
      const { phoneNumber } = req.query;
      const result = Joi.object()
        .keys({
          phoneNumber: this.validation.getPhoneNumberJoi(),
        })
        .validate(req.query);

      if (result.error) {
        throw new ValidationError(result.error.details[0].message);
      }

      await this.usersService.duplicateCheckPhone(phoneNumber);

      return res.status(200).json({ message: '사용가능한 휴대폰번호입니다.' });
    } catch (error) {
      next(error);
    }
  };

  authenticationPhone = async (req, res, next) => {
    try {
      const { phoneNumber } = req.body;
      const result = Joi.object()
        .keys({
          phoneNumber: this.validation.getPhoneNumberJoi(),
        })
        .validate(req.body);

      if (result.error) {
        throw new ValidationError(result.error.details[0].message);
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

      return res.status(200).json({ email });
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
      const result = Joi.object()
        .keys({
          email: this.validation.getEmailJoi(),
          password: this.validation.getPasswordJoi(),
        })
        .validate(req.body);

      if (result.error) {
        throw new ValidationError(result.error.details[0].message);
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
      const result = Joi.object()
        .keys({
          phoneNumber: this.validation.getNicknameJoi(),
        })
        .validate(req.body);

      if (result.error) {
        throw new ValidationError(result.error.details[0].message);
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

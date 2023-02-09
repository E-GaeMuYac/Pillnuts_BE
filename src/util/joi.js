const Joi = require('joi');

module.exports = class Validation {
  getEmailJoi = () => {
    return Joi.string().email().required().messages({
      'string.base': 'email은 문자열이어야 합니다.',
      'any.required': 'email을 입력해주세요.',
      'string.email': 'email이 형식에 맞지 않습니다.',
    });
  };
  getPhoneNumberJoi = () => {
    return Joi.string()
      .length(11)
      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        'string.base': '휴대폰번호는 문자열이어야 합니다.',
        'string.length': '휴대폰번호는 11자여야합니다',
        'string.pattern.base': '휴대폰번호가 형식에 맞지 않습니다.',
        'any.required': '휴대폰번호를 입력해주세요.',
      });
  };
  getNicknameJoi = () => {
    return Joi.string().required().messages({
      'string.base': '닉네임은 문자열이어야 합니다.',
      'any.required': '닉네임을 입력해주세요.',
    });
  };
  getPasswordJoi = () => {
    return Joi.string()
      .required()
      .pattern(new RegExp(/^(?=.*[A-Za-z])(?=.*[0-9]).{8,15}$/))
      .messages({
        'string.base': '비밀번호는 문자열이어야 합니다.',
        'any.required': '비밀번호를 입력해주세요.',
        'string.pattern.base': '비밀번호가 형식에 맞지 않습니다.',
      });
  };
  getConfirmJoi = () => {
    return Joi.string().required().valid(Joi.ref('password')).messages({
      'string.base': '비밀번호 확인은 문자열이어야 합니다.',
      'any.required': '비밀번호 확인을 입력해주세요.',
      'any.only': '비밀번호와 일치하지않습니다.',
    });
  };
  getCertificationJoi = () => {
    return Joi.boolean().invalid(false).required().messages({
      'any.required': '휴대폰 인증을 해주세요.',
      'boolean.base': 'boolean값으로 와야합니다',
      'any.invalid': '휴대폰 인증을 해주세요',
    });
  };
};

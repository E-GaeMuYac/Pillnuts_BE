const UsersRepository = require('../repositories/users.repository');
const { Users } = require('../../models/index.js');
const axios = require('axios');
const { createAuthToken } = require('../../util/token');
const { Op } = require('sequelize');

const createUrl = require('../../util/presignedUrl');
const hash = require('../../util/encryption');
const compare = require('../../util/compare');

const {
  InvalidParamsError,
  ExistError,
  AuthenticationError,
} = require('../../middlewares/exceptions/error.class.js');

class UsersService {
  constructor() {
    this.usersRepository = new UsersRepository(Users);
  }

  signUp = async (email, password, nickname, phoneNumber) => {
    const user = await this.usersRepository.findUser({
      raw: true,
      where: {[Op.or] : [ {email}, {phoneNumber}], loginType: 'Local' },
    });
    if (user) {
      throw new ExistError('중복된 유저가 존재합니다.');
    }
    password = hash(password);

    const filename = `icon${Math.floor(Math.random() * 5)}.png`;

    const imageUrl = `${process.env.ICON_URL}${filename}`;

    await this.usersRepository.signUp(
      email,
      password,
      nickname,
      phoneNumber,
      imageUrl
    );
  };

  duplicateCheckEmail = async (email) => {
    const user = await this.usersRepository.findUser({
      raw: true,
      where: { email, loginType: 'Local' },
    });
    if (user) {
      throw new ExistError('중복인 유저가 있습니다.');
    }
  };

  duplicateCheckPhone = async (phoneNumber) => {
    const user = await this.usersRepository.findUser({
      raw: true,
      where: { phoneNumber, loginType: 'Local' },
    });
    if (user) {
      throw new ExistError('중복인 유저가 있습니다.');
    }
  };

  authenticationPhone = async (phoneNumber) => {
    const token = await createAuthToken();
    const { data } = await axios.post(
      process.env.GATEWAY_PHONE,
      {
        phoneNumber,
      },
      {
        headers: {
          'authorization_Token': `Bearer ${token}`,
          'x-api-key': process.env.X_API_KEY_PHONE,
        },
      }
    );
    
    return data;
  };


  findEmail = async (phoneNumber) => {
    const user = await this.usersRepository.findUser({
      raw: true,
      where: { phoneNumber, loginType: 'Local' },
    });
    if (!user) {
      throw new InvalidParamsError('해당하는 사용자가 없습니다.');
    }
    const { email, imageUrl } = user;
    return { email, imageUrl };
  };

  findPhoneNumber = async (email) => {
    const user = await this.usersRepository.findUser({
      raw: true,
      where: { email, loginType: 'Local' },
    });
    if (!user) {
      throw new InvalidParamsError('해당하는 사용자가 없습니다.');
    }
    return user.phoneNumber;
  };

  findPassword = async (email, password) => {
    const user = await this.usersRepository.findUser({
      raw: true,
      where: { email, loginType: 'Local' },
    });
    if (!user) {
      throw new InvalidParamsError('해당하는 사용자가 없습니다.');
    }
    const checkPW = compare(password, user.password);
    if (checkPW) {
      throw new AuthenticationError('동일한 비밀번호입니다.');
    }

    password = hash(password);

    await this.usersRepository.updateUser(
      {
        password,
      },
      { where: { email, loginType: 'Local' } }
    );
  };

  logout = async (userId) => {
    const user = await this.usersRepository.findUser({
      raw: true,
      where: { userId },
    });
    if (!user) {
      throw new InvalidParamsError('로그아웃에 실패하였습니다.');
    }
    await this.usersRepository.deleteToken(userId);
  };

  findUser = async (userId) => {
    const user = await this.usersRepository.findUser({
      raw: true,
      where: { userId },
    });
    if (!user) {
      throw new InvalidParamsError('정보 조회에 실패하였습니다.');
    }

    const { nickname, imageUrl, loginType, email } = user;
    const loginCount = user.loginCount.length;

    return { nickname, loginCount, imageUrl, loginType, email, userId };
  };

  updateNickname = async (nickname, userId) => {
    const user = await this.usersRepository.findUser({
      raw: true,
      where: { userId },
    });
    if (!user) {
      throw new InvalidParamsError('정보 수정에 실패하였습니다.');
    }
    await this.usersRepository.updateUser(
      {
        nickname,
      },
      { where: { userId } }
    );
  };

  updateImg = async (userId, filename) => {
    const user = await this.usersRepository.findUser({
      raw: true,
      where: { userId },
    });

    if (!user) {
      throw new InvalidParamsError('정보 수정에 실패하였습니다.');
    }
    if (filename) {
      filename = Date.now() + filename;

      const imageUrl = `${process.env.S3URL}/${encodeURIComponent(filename)}`;

      await this.usersRepository.updateUser(
        {
          imageUrl,
        },
        { where: { userId } }
      );

      return createUrl(`${process.env.BUCKET}/${filename}`);
    } else {
      const filename = `icon${Math.floor(Math.random() * 5)}.png`;

      const imageUrl = `${process.env.ICON_URL}${filename}`;

      await this.usersRepository.updateUser(
        {
          imageUrl,
        },
        { where: { userId } }
      );
    }
  };

  deleteUser = async (userId, password) => {
    const user = await this.usersRepository.findUser({
      raw: true,
      where: { userId },
    });
    if (!user) {
      throw new InvalidParamsError('탈퇴에 실패하였습니다.');
    } else if (user.loginType === 'Local') {
      const checkPW = compare(password, user.password);
      if (!checkPW) {
        throw new AuthenticationError('패스워드를 다시 확인해주세요.');
      }
    }
    await this.usersRepository.deleteUser(userId);
  };
}

module.exports = UsersService;

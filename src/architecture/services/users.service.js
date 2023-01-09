const UsersRepository = require('../repositories/users.repository');
const { Users } = require('../../models/index.js');

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
    password = hash(password);
    await this.usersRepository.signUp(email, password, nickname, phoneNumber);
  };

  duplicateCheck = async (email) => {
    const user = await this.usersRepository.findUser({
      raw: true,
      where: { email },
    });
    if (user) {
      throw new ExistError('중복된 이메일입니다.');
    }
  };

  findEmail = async (phoneNumber) => {
    const user = await this.usersRepository.findUser({
      raw: true,
      where: { phoneNumber },
    });
    if (!user) {
      throw new InvalidParamsError('해당하는 사용자가 없습니다.');
    }
    return user.email;
  };

  findPassword = async (email, password) => {
    const user = await this.usersRepository.findUser({
      raw: true,
      where: { email },
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
      { where: { email } }
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

  updateUser = async (nickname, userId, password, filename) => {
    const user = await this.usersRepository.findUser({
      raw: true,
      where: { userId },
    });
    if (!user) {
      throw new InvalidParamsError('정보 수정에 실패하였습니다.');
    }

    const checkPW = compare(password, user.password);
    if (!checkPW) {
      throw new AuthenticationError('패스워드를 다시 확인해주세요.');
    }

    if (filename) {
      filename = Date.now() + filename;

      const imageUrl = `${process.env.S3URL}/${filename}`;

      await this.usersRepository.updateUser(
        {
          nickname,
          imageUrl,
        },
        { where: { userId } }
      );

      return createUrl(`${process.env.BUCKET}/${filename}`);
    } else {
      await this.usersRepository.updateUser(
        {
          nickname,
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
    }
    const checkPW = compare(password, user.password);
    if (!checkPW) {
      throw new AuthenticationError('패스워드를 다시 확인해주세요.');
    }
    await this.usersRepository.deleteUser(userId);
  };
}

module.exports = UsersService;

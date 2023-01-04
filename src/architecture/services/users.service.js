const UsersRepository = require('../repositories/users.repository');
const { Users } = require('../../models/index.js');

const hash = require('../../util/encryption');
const compare = require('../../util/decryption');

const {
  InvalidParamsError,
  ExistError,
  AuthenticationError,
} = require('../../middlewares/exceptions/error.class.js');

class UsersService {
  constructor() {
    this.usersRepository = new UsersRepository(Users);
  }

  signUp = async (email, password, nickname) => {
    password = hash(password);
    await this.usersRepository.signUp(email, password, nickname);
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

  updateUser = async (nickname, userId, password) => {
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
    await this.usersRepository.updateUser(nickname, userId);
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

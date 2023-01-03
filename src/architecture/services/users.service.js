const UsersRepository = require('../repositories/users.repository');
const { Users } = require('../../models/index.js');

const hash = require('../../util/encryption');

const {
  InvalidParamsError,
} = require('../../middlewares/exceptions/error.class.js');

class UsersService {
  constructor() {
    this.usersRepository = new UsersRepository(Users);
  }

  signUp = async (email, password, nickname) => {
    password = await hash(password);
    await this.usersRepository.signUp(email, password, nickname);
  };

  duplicateCheck = async (email) => {
    const user = await this.usersRepository.findUser({
      raw: true,
      where: { email },
    });
    if (user) {
      throw new Error('중복된 이메일입니다.');
    }
  };

  logout = async (userId) => {
    const user = await this.usersRepository.findUser({
      raw: true,
      where: { userId },
    });
    if (!user) {
      throw new Error('로그아웃에 실패하였습니다.');
    }
    await this.usersRepository.deleteToken(userId);
  };
}

module.exports = UsersService;

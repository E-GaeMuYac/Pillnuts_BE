const LoginRepository = require('../repositories/login.repository');
const {
  ExistError,
  ValidationError,
} = require('../../middlewares/exceptions/error.class');

const compare = require('../../util/compare');
const formatDate = require('../../util/formatDate');

require('dotenv').config();
const { createAccessToken, createRefreshToken } = require('../../util/token');

class LoginService {
  loginRepository = new LoginRepository();

  existUser = async (email, password) => {
    const existUser = await this.loginRepository.existUser(email);
    if (!existUser) {
      throw new ValidationError('로그인 정보를 다시 확인해주세요.', 412);
    }

    const match = compare(password, existUser.password);
    if (!match) {
      throw new ValidationError('로그인 정보를 다시 확인해주세요.', 412);
    }
    const accesstoken = await createAccessToken(existUser.userId);
    const refreshtoken = await createRefreshToken();

    const today = formatDate(new Date());
    const loginCount = existUser.loginCount;
    const existLogin = loginCount.filter((day) => day == today);

    if (!existLogin.length) {
      loginCount.push(today);
    }

    await this.loginRepository.updateUser(
      existUser.userId,
      refreshtoken,
      loginCount
    );
    return { accesstoken, refreshtoken, existUser };
  };
}

module.exports = LoginService;

const LoginRepository = require('../repositories/login.repository');
const {
  ExistError,
  ValidationError,
} = require('../../middlewares/exceptions/error.class');

const compare = require('../../util/compare');

require('dotenv').config();
const jwt = require('jsonwebtoken');
const { createAccessToken, createRefreshToken } = require('../../util/token');

class LoginService {
  loginRepository = new LoginRepository();

  existUser = async (email, password) => {
    const existUser = await this.loginRepository.existUser(email); // 2. Users에 ExistUser의 email이 있는지 찾아본다.
    if (!existUser) {
      throw new ExistError(
        '로그인 정보를 다시 확인해주세요.', // 2-1. Users에 ExistUser의 email이 없다면, ExistError(412)를 띄운다.
        412
      );
    }

    const match = compare(password, existUser.password); // 3. 비밀번호를 확인한다. -> existUser의 password만 불러온다.
    if (!match) {
      throw new ValidationError(
        '비밀번호가 일치하지 않습니다.', // 3-1. 입력한 비밀번호와 db에 저장되어있는 비번을 compare해서 비밀번호가 일치하지 않은 경우, validationError(412)를 띄운다.
        412
      );
    }
    const accesstoken = await createAccessToken(existUser.userId); // 4. 비밀번호가 일치한다면, access token + refresh token을 발급해준다. (헤더(표준이라서..ㅎ*)에 넣어줘서 프론트로 보내준다.)
    const refreshtoken = await createRefreshToken();

    await this.loginRepository.updateUser(existUser.userId, refreshtoken);
    return { accesstoken, refreshtoken, existUser }; // 5. 로그인 성공!
  };
 
}

module.exports = LoginService;

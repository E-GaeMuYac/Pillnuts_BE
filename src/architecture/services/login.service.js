const LoginRepository = require('../repositories/login.repository');
const {
    ExistError,
    ValidationError,
} = require('../../middlewares/exceptions/error.class');

require('dotenv').config();
const crypto = require('crypto');
// const jwt = reqiure('jsonwebtoken');

class LoginService {
    loginRepository = new LoginRepository();

    existUser = async (email, password) => {
        const secretPW = crypto
            .createHash(process.env.PW_KEY)
            .update(password)
            .digest(process.env.INCOD);

        password = secretPW;

        const existUser = await this.loginRepository.existUser(email, password);

        if (!existUser || existUser.length === 0) {
            throw new ExistError('로그인 정보를 다시 확인해주세요.',
            412
            );
        }
        return existUser;
    };
}

module.exports = LoginService;
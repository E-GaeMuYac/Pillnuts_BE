const {
    ExistError, 
    InvalidParamsError,
} = require('../../middlewares/exceptions/error.class');
// const url = require('url');
require('dotenv').config({ path: '../.env' });

const LoginService = require('../services/login.service');

class LoginController {
    loginService = new LoginService();

    Login = async (req, res, next) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                throw new ExistError(
                    '이메일 혹은 패스워드를 다시 입력해주세요',
                    412
                );
            }
            const existUser = await this.loginService.existUser(email, password);
            const accessToken = this.loginService.createAccessToken(
                existUser.userId
            );

            return res
                .header('token', accessToken)
                .status(201)
                .json({ userId : existUser.userId, nickname : existUser.nickname, token: accessToken });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = LoginController;
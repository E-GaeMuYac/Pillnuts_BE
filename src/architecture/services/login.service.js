const LoginRepository = require('../repositories/login.repository');
const {
    ExistError,
    ValidationError,
} = require('../../middlewares/exceptions/error.class');

const bcrypt = require('bcrypt');
const salt = Number(process.env.SALT);
const hash = require('../../util/encryption');
require('dotenv').config();
 const jwt = require('jsonwebtoken');


class LoginService {
    loginRepository = new LoginRepository();

    existUser = async (email, password) => {
       password = await hash(password);
    
    const existUser = await this.loginRepository.existUser(email, password);

if (!existUser) {
            throw new ExistError('로그인 정보를 다시 확인해주세요.',
            412
            );
        }
        return existUser;


    }  
    };

 
    createAccessToken = (userId) => {
        return jwt.sign({ userId }, process.env.SALT, {
            expiresIn: '2h',
        });
    };


module.exports = LoginService;
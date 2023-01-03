const { Op } = require('sequelize');

class UsersRepository {
  constructor(UsersModel) {
    this.usersModel = UsersModel;
  }

  signUp = async (email, password, nickname) => {
    await this.usersModel.create({
      email,
      password,
      nickname,
    });
  };

  findUser = async (data) => {
    return this.usersModel.findOne(data);
  };

  deleteToken = async (userId) => {
    await this.usersModel.update(
      { refreshtoken: '' },
      {
        where: { userId },
      }
    );
  };
}

module.exports = UsersRepository;

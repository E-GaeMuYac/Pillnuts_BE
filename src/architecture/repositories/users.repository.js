const { Op } = require('sequelize');

class UsersRepository {
  constructor(UsersModel) {
    this.usersModel = UsersModel;
  }

  signUp = async (email, password, nickname, phoneNumber) => {
    await this.usersModel.create({
      email,
      password,
      nickname,
      phoneNumber,
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

  updateUser = async (nickname, userId, imageUrl) => {
    await this.usersModel.update(
      {
        nickname,
        imageUrl,
      },
      { where: { userId } }
    );
  };

  deleteUser = async (userId) => {
    await this.usersModel.destroy({
      where: { userId },
    });
  };
}

module.exports = UsersRepository;

class UsersRepository {
  constructor(UsersModel) {
    this.usersModel = UsersModel;
  }

  signUp = async (email, password, nickname, phoneNumber, imageUrl) => {
    await this.usersModel.create({
      email,
      password,
      nickname,
      phoneNumber,
      imageUrl,
      loginType: 'Local',
    });
  };

  findUser = async (data) => {
    return this.usersModel.findOne(data);
  };

  findUsers = async (data) => {
    return this.usersModel.findAll(data);
  };

  deleteToken = async (userId) => {
    await this.usersModel.update(
      { refreshtoken: null },
      {
        where: { userId },
      }
    );
  };

  updateUser = async (data, where) => {
    await this.usersModel.update(data, where);
  };

  deleteUser = async (userId) => {
    await this.usersModel.destroy({
      where: { userId },
    });
  };
}

module.exports = UsersRepository;

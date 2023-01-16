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
      loginType: 'Local',
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

const { Users } = require('../../models');

class LoginRepository {
  existUser = async (email) => {
    return Users.findOne({ raw: true, where: { email, loginType: 'Local' } });
  };

  updateUser = async (userId, refreshtoken, loginCount) => {
    await Users.update({ refreshtoken, loginCount }, { where: { userId } });
  };
}

module.exports = LoginRepository;

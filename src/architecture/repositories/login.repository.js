const { Users } = require('../../models');

class LoginRepository {
  existUser = async (email) => {
    return Users.findOne(
      // 2. Users에 ExistUser의 email이 있는지 찾아본다.

      { raw: true, where: { email, loginType: 'Local' } } // Users에서 findOne 하고 where절에서 일치하는 email, local에서만 로그인된 것을 데려온다.
    );
  };

  updateUser = async (userId, refreshtoken, loginCount) => {
    await Users.update(
      { refreshtoken, loginCount }, // -> userId가 일치하면, refresh token을 갱신(update)해준다.
      { where: { userId } } // Users에서 일치하는 userId만 데려온다.
    );
  };
}

module.exports = LoginRepository;

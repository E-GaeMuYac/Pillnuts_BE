const bcrypt = require('bcrypt');

const compare = (password, checkPW) => {
  return bcrypt.compareSync(password, checkPW);
};

module.exports = compare;

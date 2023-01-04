require('dotenv').config();
const bcrypt = require('bcrypt');
const salt = Number(process.env.SALT);

const hash = (password) => {
  return bcrypt.hash(password, salt);
};

module.exports = hash;

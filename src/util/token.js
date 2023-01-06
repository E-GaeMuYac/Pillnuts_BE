const jwt = require('jsonwebtoken');
require('dotenv').config();

createAccessToken = (userId) => {
    return jwt.sign({ userId }, 
    process.env.SECRET_KEY, 
    { expiresIn: '2h' } 
);
};

createRefreshToken = () => {
    return jwt.sign({}, 
    process.env.SECRET_KEY, 
    { expiresIn: '7d' }
);
};

module.exports = {createAccessToken, createRefreshToken};
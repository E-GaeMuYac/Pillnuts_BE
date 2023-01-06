const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("./exceptions/error.class");
const { Users } = require('../models');

module.exports = async (req, res, next) => {
    try {
        // 토큰이 없을 경우
        if (!req.headers.token) {
            throw new AuthenticationError("accessToken이 없습니다.", 404)
        };

        const accessToken = req.headers.token;
        const refreshToken = req.headers.token;

        // access token, refresh token 확인
        const isAccessTokenValidate = validateAccessToken(accessToken);
        const isRefreshTokenValidate = validateRefreshToken(refreshToken);

         // RefreshToken이 만료일 경우,
         if (!isRefreshTokenValidate) {
            throw new AuthenticationError("로그인이 유효하지 않습니다.",
            401)
        };
        
        // AccessToken을 확인 했을 때 만료일 경우,
        if (!isAccessTokenValidate) {
            const user = await Users.findOne({
                raw: true,
                where: { refreshToken },
                attribute: ['userId'],
            });
            if (!user) {
                throw new AuthenticationError("로그인이 유효하지 않습니다.",
                401)
            };

            // 새로운 Access token을 발급해준다.
            const newAccessToken = createAccessToken(user.userId);
            res.header('accesstoken', newAccessToken);
            accesstoken = newAccessToken;
        }

        const { userId } = getAccessTokenPayload(accessToken);
        res.locals.userId = userId;
        
        next();
    } catch (err) {
        next(err);
    }
};

// Access Token을 검증한다.
function validateAccessToken(accessToken) {
    try {
        jwt.verify(accessToken, process.env.SECRET_KEY); // JWT를 검증한다.
        return true;
    } catch (error) {
        return false;
    }
}

// Refresh Token을 검증한다.
function validateRefreshToken(refreshToken) {
    try {
        jwt.verify(refreshToken, process.env.SECRET_KEY); // JWT를 검증한다.
        return true;
    } catch (error) {
        return false;
    }
}


// Access Token의 Payload를 가져온다.
function getAccessTokenPayload(accessToken) {
    try {
        return jwt.verify(accessToken, process.env.SECRET_KEY); 
    } catch (error) {
        return null;
    }
}

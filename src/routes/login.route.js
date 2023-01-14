const express = require('express');
const router = express.Router();
const loginMiddleware = require('../middlewares/login.middleware');
const LoginController = require('../architecture/controllers/login.controller');
const loginController = new LoginController();

// Local Login
router.post('/normal', loginMiddleware, loginController.Login);

// Google Login
router.get('/google', loginMiddleware, loginController.google);
router.get('/google/callback', loginMiddleware, loginController.googleCallback);
router.get('/', loginMiddleware, loginController.responseToken);

// Naver Login
router.get('/naver', loginMiddleware, loginController.naver);
router.get('/naver/callback', loginMiddleware, loginController.naverCallback);

// Kakao Login
router.get('/kakao', loginMiddleware, loginController.kakao);
router.get('/kakao/callback', loginMiddleware, loginController.kakaoCallback);


module.exports = router;

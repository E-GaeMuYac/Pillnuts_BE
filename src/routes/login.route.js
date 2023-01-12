const express = require('express');
const router = express.Router();
const passport = require('passport')
const loginMiddleware = require('../middlewares/login.middleware');
const LoginController = require('../architecture/controllers/login.controller');
const loginController = new LoginController();

// Local Login
router.post('/normal', loginMiddleware, loginController.Login);

// Google Login
router.get('/google', loginController.Google);
router.get('/google/callback', loginController.GoogleCallback);
router.get('/', loginController.ResponseToken);

// Naver Login
router.get('/naver', loginController.Naver);
router.get('/naver/callback', loginController.NaverCallback);


// Kakao Login


module.exports = router;

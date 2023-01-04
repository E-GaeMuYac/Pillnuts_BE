const express = require('express');
const router = express.Router();

const authUser = require('../middlewares/authUser.middleware');
const LoginController = require('../architecture/controllers/login.controller');
const loginController = new LoginController

// login 
router.post('/login', loginController.Login);

module.exports = router;
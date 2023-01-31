const express = require('express');
const router = express.Router();
const loginMiddleware = require('../middlewares/login.middleware');
const authMiddleware = require('../middlewares/authUser.middleware');
const UsersController = require('../architecture/controllers/users.controller');
const { limiter } = require('../middlewares/rateLimit.middleware');
const usersController = new UsersController();

router.post('/signup', loginMiddleware, usersController.signUp);
router.get('/signup', usersController.duplicateCheck);
router.get('/find/email', loginMiddleware, usersController.findEmail);
router.get(
  '/find/phoneNumber',
  loginMiddleware,
  usersController.findPhoneNumber
);
router.post(
  '/authentication/email',
  limiter,
  loginMiddleware,
  usersController.authenticationEmail
);
router.post(
  '/authentication/phone',
  limiter,
  loginMiddleware,
  usersController.authenticationPhone
);
router.put('/find/password', loginMiddleware, usersController.findPassword);
router.put('/logout', authMiddleware, usersController.logout);
router.get('/find', authMiddleware, usersController.findUser);
router.put('/update/nickname', authMiddleware, usersController.updateNickname);
router.put('/update/image', authMiddleware, usersController.updateImg);
router.delete('/delete', authMiddleware, usersController.deleteUser);

module.exports = router;

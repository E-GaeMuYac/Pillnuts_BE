const express = require('express');
const router = express.Router();
const loginMiddleware = require('../middlewares/login.middleware');
const authMiddleware = require('../middlewares/authUser.middleware');
const UsersController = require('../architecture/controllers/users.controller');
const usersController = new UsersController();

router.post('/signup', loginMiddleware, usersController.signUp);
router.get('/signup', usersController.duplicateCheck);
router.put('/logout', authMiddleware, usersController.logout);
router.put('/update', authMiddleware, usersController.updateUser);
router.delete('/delete', authMiddleware, usersController.deleteUser);

module.exports = router;

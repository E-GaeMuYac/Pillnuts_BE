const express = require('express');
const router = express.Router();
const UsersController = require('../architecture/controllers/users.controller');
const usersController = new UsersController();

router.post('/signup', usersController.signUp);
router.get('/signup', usersController.duplicateCheck);
router.put('/logout', usersController.logout);
router.put('/update', usersController.updateUser);

module.exports = router;

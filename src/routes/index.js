const express = require('express');
const router = express.Router();
const authUser = require('../middlewares/authUser.middleware');

router.use('/users', require('./users.route'));
router.use('/api/users/login', require('./login.route'));


module.exports = router;

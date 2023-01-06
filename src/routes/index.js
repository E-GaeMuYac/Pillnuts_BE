const express = require('express');
const router = express.Router();
const loginMiddleware = require('../middlewares/login.middleware');

router.use('/api/users/login', loginMiddleware, require('./login.route'));
router.use('/api/products', require('./products.route'));
router.use('/api/users', require('./users.route'));

module.exports = router;

const express = require('express');
const router = express.Router();
const loginMiddleware = require('../middlewares/login.middleware');

router.use('/users', require('./users.route'));
router.use('/api/users/login', loginMiddleware, require('./login.route'));


router.use('/api/products', require('../routes/products.route'));
router.use('/api/users', require('./users.route'));

module.exports = router;

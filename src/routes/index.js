const express = require('express');
const router = express.Router();

router.use('/api/users/login', require('./login.route'));
router.use('/api/products', require('./products.route'));
router.use('/api/users', require('./users.route'));
router.use('/api/posts', require('./post.route'));

module.exports = router;

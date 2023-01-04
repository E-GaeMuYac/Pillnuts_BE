const express = require('express');
const router = express.Router();

router.use('/api/products', require('../routes/products.route'));
router.use('/api/users', require('./users.route'));

module.exports = router;

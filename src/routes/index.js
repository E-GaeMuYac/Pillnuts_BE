const express = require('express');
const router = express.Router();

router.use('/api/users', require('./login.route'));

module.exports = router;

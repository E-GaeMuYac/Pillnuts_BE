const limit = require('express-rate-limit');

exports.limiter = limit({
  windowMs: 60000 * 3,
  max: 10,
  keyGenerator: (req, res) => {
    return req.ip;
  },
  handler(req, res) {
    res.status(429).json({
      message: '3분에 1번만 요청이 가능합니다.',
    });
  },
});

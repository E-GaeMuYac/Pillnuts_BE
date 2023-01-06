const express = require('express');
const app = express();
const routes = require('./routes');
const loginRouter = require('./routes/login.route');

require('dotenv').config();

app.use(express.json());
app.use('/', routes);
app.use('/login', loginRouter); // kakao로그인 요청이 서버로 온다.

const ErrorHandler = require('./middlewares/error.handler.middleware');
app.use(ErrorHandler);

app.listen(process.env.PORT, () => {
  console.log(process.env.PORT, '포트로 서버가 열렸습니다.');
});

app.get('/', (req, res) => {
  res.send(`TEST5 ${process.env.PORT}`);
});

module.exports = app;
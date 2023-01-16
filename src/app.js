const express = require('express');
const session = require('express-session');
const app = express();
const routes = require('./routes');
const cors = require('cors');
const passport = require('passport');
const passportConfig = require('./passport/index');


require('dotenv').config();

const corsOption = {
  origin: true,
  credentials: true,
  withCredential: true,
  optionsSuccessStatus: 200,
  exposedHeaders: ['accesstoken', 'refreshtoken'],
};
app.use(cors(corsOption));
app.use(express.json());
passportConfig();

const ErrorHandler = require('./middlewares/error.handler.middleware');
app.use(ErrorHandler);

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
  })
);
// express-session이 router 위에 와야함
app.use(passport.initialize()); // 요청 객체에 passport 설정을 심음
app.use(passport.session()); // req.session 객체에 passport 정보를 추가 저장
// passport.session()이 실행되면, 세션쿠키 정보를 바탕으로 해서 passport/index.js의 deserializeUser()가 실행하게 됨

app.use('/', routes);

app.listen(process.env.PORT, () => {
  console.log(process.env.PORT, '포트로 서버가 열렸습니다.');
});

app.get('/', (req, res) => {
  res.send(`TEST5 ${process.env.PORT}`);
});

module.exports = app;

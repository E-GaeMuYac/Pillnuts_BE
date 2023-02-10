const express = require('express');
const session = require('express-session');
const app = express();
const helmet = require('helmet');
const routes = require('./routes');
const cors = require('cors');
const passport = require('passport');
const passportConfig = require('./passport/index');
const ErrorHandler = require('./middlewares/error.handler.middleware');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('../swagger-output.json');

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

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
  })
);
app.use(helmet());
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(ErrorHandler);

app.listen(process.env.PORT, () => {
  console.log(process.env.PORT, '포트로 서버가 열렸습니다.');
});

app.get('/', (req, res) => {
  res.send(`TEST5 ${process.env.PORT}`);
});

module.exports = app;

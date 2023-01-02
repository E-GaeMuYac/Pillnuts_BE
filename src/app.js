const express = require('express');
const app = express();
const routes = require('./routes');

require('dotenv').config();

app.use(express.json());
app.use('/', routes);

const ErrorHandler = require('./middlewares/error.handler.middleware');
app.use(ErrorHandler);

app.listen(process.env.PORT, () => {
  console.log(process.env.PORT, '포트로 서버가 열렸습니다.');
});

app.get('/', (req, res) => {
  res.send(`TEST2 ${process.env.PORT}`);
});

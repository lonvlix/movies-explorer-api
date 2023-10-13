const express = require('express');
// const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');
// const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
// const ratelimiter = require('./middlewares/rateLimiter');

const routes = require('./routes/index');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log(`Connected to ${DB_URL}`);
  })
  .catch((err) => console.log(err));

const app = express();

// app.use(cors());

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet());

// app.use(ratelimiter);

app.use(requestLogger);

app.use(routes);

app.use(errorLogger);

app.use(errors());

// app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
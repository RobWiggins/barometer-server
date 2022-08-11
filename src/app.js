'use strict';

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const tweetsRouter = require('./tweets/tweets-router');
const historyRouter = require('./history/history-router');

const app = express();

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'dev';

const corsOptions = {
  origin: 'https://barometerapp.vercel.app',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) will choke on 204
}

app.use(morgan(morganOption));
app.use(cors(corsOptions));
app.use(helmet());

app.use('/tweets/queries', tweetsRouter);
app.use('/queries/history', historyRouter);

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;

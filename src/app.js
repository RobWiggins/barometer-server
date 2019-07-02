'use strict';

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const tweetsRouter = require('./tweets/tweets-router');
// const foldersRouter = require('./folders/folders-router');
const retrieveTweetsRouter = require('./tweets/retrieve-tweets');

const app = express();

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'dev';

app.use(morgan(morganOption));
app.use(cors());
app.use(helmet());

// what additional stuff??
// console.log('i made it here');
// app.use('/folders', foldersRouter);
app.use('/tweets/queries', tweetsRouter);

// app.get('/', (req, res) => {
//   res.status(200).send('Hello, server and boilerplate!');
// });

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

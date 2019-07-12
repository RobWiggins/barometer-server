'use strict';

const express = require('express');
const knex = require('knex');
const path = require('path'); // need? join posix?
const queriesService = require('./queries-service');
const xss = require('xss');
const tweetRetriever = require('../tweets/retrieve-tweets');
const emotionRetriever = require('../emotions/emotion-retriever');

const historyRouter = express.Router();
const jsonBodyParser = express.json();

// TODO GET history may be redundant depending on client implementation
historyRouter
  .route('/')
  .get((req, res, next) => {
    queriesService.getAllQueries(req.app.get('db')).then(queries => {
      // console.log('QUERIES: ', queries);
      res.status(200).send({
        'queries': queries,
      });
    });
  })
  .post(jsonBodyParser, (req, res, next) => {
    // console.log('BODY: ', req.body);
    const newQuery = {query: req.body.query} ;
    queriesService
      .insertQuery(req.app.get('db'), newQuery)
      .then(inserted => {
        res.status(201).send(inserted); // TODO right thing to send??
      })
      .catch(err => console.log('err in history request: ', err));  });

module.exports = historyRouter;
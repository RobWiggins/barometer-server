'use strict';

const express = require('express');
const knex = require('knex');
const path = require('path');
const queriesService = require('./queries-service');
const xss = require('xss');
const tweetRetriever = require('../tweets/retrieve-tweets');
const emotionRetriever = require('../emotions/emotion-retriever');

const historyRouter = express.Router();
const jsonBodyParser = express.json();

historyRouter
  .route('/')
  .get((req, res, next) => {
    queriesService.getAllQueries(req.app.get('db')).then(queries => {
      res.status(200).send({
        'queries': queries,
      });
    });
  })
  .post(jsonBodyParser, (req, res, next) => {
    const newQuery = {query: req.body.query} ;
    queriesService
      .insertQuery(req.app.get('db'), newQuery)
      .then(inserted => {
        res.status(201).send(inserted);
      })
      .catch(err => console.log('err in history request: ', err));  });

module.exports = historyRouter;
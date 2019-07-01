/* TODO RERIG UP TO ADJUST FOR TWEETS */
'use strict';

const express = require('express');
const knex = require('knex');
const path = require('path'); // need? join posix?
const tweetsService = require('./tweets-service');
const xss = require('xss');

const retrieveTweetsRouter = express.Router();
const jsonBodyParser = express.json();

const serializeTweet = tweet => ({
  id: tweet.id,
  title: xss(tweet.title),
  modified: tweet.modified,
  folderId: tweet.folderId,
  content: xss(tweet.content),
});

retrieveTweetsRouter
  .route('/')
  .get((req, res, next) => {

    /* TODO request tweets from twitter */
    


    const knexInstance = req.app.get('db');
    tweetsService.getAlltweets(knexInstance)
      .then(tweets => res.json(tweets.map(serializeTweet)))
      .catch(next);
  })


module.exports = retrieveTweetsRouter;
'use strict';

const express = require('express');
const tweetRetriever = require('./retrieve-tweets');
const emotionRetriever = require('../emotions/emotion-retriever');

const tweetsRouter = express.Router();
const jsonBodyParser = express.json();

tweetsRouter.route('/:query').get(jsonBodyParser, (req, res, next) => {
  let options = {
    q: req.params.query,
    lang: 'en',
    result_type: 'mixed',
  };
  options = JSON.stringify(options);

  tweetRetriever.tweet_path(req.params.query).then(resolvedPromiseTweetData => {
    /* send tweets to watson api */
    emotionRetriever
      .fetchEmotions(resolvedPromiseTweetData, req.params.query)
      .then(analysisResults => {
        // ready tweet array to send to front end
        let statuses = resolvedPromiseTweetData.statuses;
        const tweetContentArr = emotionRetriever.getFullTextFromRT(statuses);
        const duplicatesFiltered = emotionRetriever.filterDuplicateTweets(
          tweetContentArr
        );
        res.status(200).send({
          watsonEmotionResults: analysisResults,
          duplicatesFiltered,
          currentQuery: req.params.query,
        });
      });
  })
    .catch(err => {
      console.error(err);
      res.status(500).send('something went wrong with request');
    });

});

module.exports = tweetsRouter;

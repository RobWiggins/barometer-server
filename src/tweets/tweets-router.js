'use strict';

const express = require('express');
const tweetRetriever = require('./retrieve-tweets');
const emotionRetriever = require('../emotions/emotion-retriever');

const tweetsRouter = express.Router();
const jsonBodyParser = express.json();

tweetsRouter.route('/:query').get(jsonBodyParser, (req, res, next) => {

  tweetRetriever.tweet_path(req.params.query).then(resolvedPromiseTweetData => {
    /* send tweets to watson api */
    console.log('resolvedPromiseTweetData', resolvedPromiseTweetData);
    emotionRetriever
      .fetchEmotions(resolvedPromiseTweetData, req.params.query)
      .then(analysisResults => {
        // ready tweet array to send to front end
        console.log('analysisResults', analysisResults);
        // let statuses = resolvedPromiseTweetData.statuses;
        // console.log('statuses', statuses);
        // const postContentArr = emotionRetriever.getFullTextFromRT(resolvedPromiseTweetData);
        // TODO do this before sending to watson?? probably.
        const duplicatesFiltered = emotionRetriever.filterDuplicatePosts(
          resolvedPromiseTweetData
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

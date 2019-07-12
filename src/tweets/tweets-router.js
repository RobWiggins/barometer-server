'use strict';

/* TODO RERIG UP TO ADJUST FOR TWEETS */

const express = require('express');
const knex = require('knex');
const path = require('path'); // need? join posix?
const queriesService = require('../history/queries-service');
const xss = require('xss');
const tweetRetriever = require('./retrieve-tweets');
const emotionRetriever = require('../emotions/emotion-retriever');

const tweetsRouter = express.Router();
const jsonBodyParser = express.json();

// change to correct fields
// const serializeTweet = tweet => ({
//   id: tweet.id,
//   title: xss(tweet.title), // where and when to sanitize??
//   modified: tweet.modified,
//   folderId: tweet.folderId,
//   content: xss(tweet.content),
// });

tweetsRouter.route('/:query').get(jsonBodyParser, (req, res, next) => {
  // const knexInstance = req.app.get('db');
  // console.log('i made it to the tweetsRouter GET request');
  // console.log(req);
  let options = {
    q: req.params.query,
    lang: 'en',
    result_type: 'mixed',
  };
  options = JSON.stringify(options);
  // console.log(options);

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
        // console.log(JSON.stringify(analysisResults, null, 2));
        // get queries history and send response
        // console.log({
        //   watsonEmotionResults: analysisResults,
        //   duplicatesFiltered,
        //   currentQuery: req.params.query,
        // });
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

  // .then(resEmotions => console.log(resEmotions));

  // .then(response => {
  //   if (!response.ok) {
  //     throw new Error('An error occured when trying to retrieve the tweets');
  //   }
  //   console.log('response: ', response);
  //   return response;
  // })
  // .then(data => {
  //   console.log(data);
  //   return res.status(200).json(data);
  // })
  // .catch(error => res.status(400).send({ err: error.message }));
});

module.exports = tweetsRouter;

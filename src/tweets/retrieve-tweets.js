/* TODO RERIG UP TO ADJUST FOR TWEETS */
'use strict';

const express = require('express');
const knex = require('knex');
const path = require('path'); // need? join posix?
const tweetsService = require('./tweets-service');
const xss = require('xss');
require('dotenv').config();
const OAuth = require('oauth');

// const retrieveTweetsRouter = express.Router();
// const jsonBodyParser = express.json();

// const serializeTweet = tweet => ({
//   id: tweet.id,
//   title: xss(tweet.title),
//   modified: tweet.modified,
//   folderId: tweet.folderId,
//   content: xss(tweet.content),
// });

const retrieveTweets = {
  requestAllTweets(options) {
    // console.log('i made it to requestAllTweets retrieveTweets module');

    /* npm oAuth */
    let oauth = new OAuth.OAuth(
      `https://api.twitter.com/oauth/${process.env.OAUTH_ACCESS_TOKEN}`,
      `https://api.twitter.com/oauth/${process.env.OAUTH_ACCESS_TOKEN_SECRET}`,
      `${process.env.OAUTH_CONSUMER_KEY}`,
      `${process.env.OAUTH_CONSUMER_SECRET_KEY}`,
      '1.0A',
      null,
      'HMAC-SHA1'
    );

    let returnedTweets;

    oauth.get(
      'https://api.twitter.com/1.1/search/tweets.json?q=butterflies',
      process.env.OAUTH_ACCESS_TOKEN, //test user token
      process.env.OAUTH_ACCESS_TOKEN_SECRET, //test user secret
      function(e, data, res) {
        if (e) console.error(e);
        returnedTweets = require('util').inspect(data);
        console.log(returnedTweets);
        // console.log(returnedTweets);
        // return returnedTweets;
        // done();
      });

    

    // const jsonOptions = JSON.stringify(options);

    // fetch('https://api.twitter.com/1.1/search/tweets.json?q=elephants')
    //   .then(response => {
    //     if (!response.ok) {
    //       return 'there was an error during twitter call';
    //     }
    //     return response.json(); // what to do about res.json(response.json here)
    //   })
    //   .then(data => json(data))
    //   .catch(error => console.log(error));

    // console.log('i made it here');
    // console.log(req.body.query);

    /* TODO request tweets from twitter */

    // const knexInstance = req.app.get('db');
    // tweetsService.getAlltweets(knexInstance)
    //   .then(tweets => res.json(tweets.map(serializeTweet)))
    //   .catch(next);
  },
};

module.exports = retrieveTweets;

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

const tweetRetriever = {
  // fetchTweets(options) {
  //   // console.log('i made it to requestAllTweets retrieveTweets module');
  //   // const jsonOptions = JSON.stringify(options);

  //   /* npm oAuth */
  //   // let oauth = new OAuth.OAuth(
  //   //   `https://api.twitter.com/oauth/${process.env.OAUTH_ACCESS_TOKEN}`,
  //   //   `https://api.twitter.com/oauth/${process.env.OAUTH_ACCESS_TOKEN_SECRET}`,
  //   //   `${process.env.OAUTH_CONSUMER_KEY}`,
  //   //   `${process.env.OAUTH_CONSUMER_SECRET_KEY}`,
  //   //   '1.0A',
  //   //   null,
  //   //   'HMAC-SHA1'
  //   // );

  //   // let returnedTweets;
  // },
  tweet_path(query) {
    let path = `https://api.twitter.com/1.1/search/tweets.json?q=${query}&tweet_mode=extended&count=30&lang=en`;
    let token = process.env.OAUTH_ACCESS_TOKEN; //test user token
    let secret = process.env.OAUTH_ACCESS_TOKEN_SECRET; //test user secret

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

    return new Promise(function(resolve, reject) {
      oauth.get(path, token, secret, function(e, data, res) {
        if (e) {
          console.error(e);
          reject(e);
        } else {
          const returnedTweets = JSON.parse(data);
          // returnedTweets = require('util').inspect(data);
          // console.log(returnedTweets);
          resolve(returnedTweets);
        }
      });
    });
  },
};

// oauth.get(
//   'https://api.twitter.com/1.1/search/tweets.json?q=butterflies',
//   process.env.OAUTH_ACCESS_TOKEN, //test user token
//   process.env.OAUTH_ACCESS_TOKEN_SECRET, //test user secret
//   function(e, data, res) {
//     if (e) console.error(e);
//     returnedTweets = require('util').inspect(data);
//     // tweetRetriever.returnTweetsToRouter(returnedTweets);
//     // console.log(returnedTweets);
//     /* TODO HOW TO SEND TO TWEETS ROUTER?? WHAT IS DONE()? */
//     // console.log(returnedTweets);
//     // return returnedTweets;
//     // return res;
//     return Promise.resolve(returnedTweets);
//   });
// returnTweetsToRouter(tweets) {
//   /* but fetchTweets function itself is not an asynch function so this isnt working */
//   /* pass in this function above??*/
//   return Promise.resolve(tweets);
// }

// };

module.exports = tweetRetriever;

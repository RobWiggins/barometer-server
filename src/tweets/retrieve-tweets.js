/* TODO RERIG UP TO ADJUST FOR TWEETS */
'use strict';

const express = require('express');
const knex = require('knex');
const path = require('path'); // need? join posix?
const tweetsService = require('./tweets-service');
const xss = require('xss');

const retrieveTweetsRouter = express.Router();
const jsonBodyParser = express.json();

// const serializeTweet = tweet => ({
//   id: tweet.id,
//   title: xss(tweet.title),
//   modified: tweet.modified,
//   folderId: tweet.folderId,
//   content: xss(tweet.content),
// });

retrieveTweetsRouter
  .route('/')
  .get((req, res, next) => {
    console.log('i made it to retrieveTweetsRouter GET');

    /* npm oAuth */

    // CURL
    //     'authorization: OAuth oauth_consumer_key="consumer-key-for-app",
    //  oauth_nonce="generated-nonce", oauth_signature="generated-signature",
    //  oauth_signature_method="HMAC-SHA1", oauth_timestamp="generated-timestamp",
    //  oauth_token="access-token-for-authed-user", oauth_version="1.0"'

    let headers = new Headers({
      // OAUTH data
      authorization: `OAuth oauth_consumer_key="aD1EHXT9vnC09slAnXECAAFxh",oauth_token="2949483837-FebnlgUQxbFMKLYTxjsVIwuJT1zIx0buMphWwzV",oauth_signature_method="HMAC-SHA1",oauth_timestamp="1562011341",oauth_nonce="wzgXnfpTTrg",oauth_version="1.0",oauth_signature="CjcN%2FBiNHLIwQ%2BAL8Gl6wo8LlM4%3D"`
    });

    /* Temp */
    const options = {
      headers,
      method: 'GET',
    };

    const jsonOptions = JSON.stringify(options);

    fetch(
      'https://api.twitter.com/1.1/search/tweets.json?q=elephants',
      headers
    )
      .then(response => {
        if (!response.ok) {
          return 'there was an error during twitter call';
        }
        return response.json(); // what to do about res.json(response.json here)
      })
      .then(data => res.json(data))
      .catch(error => console.log(error));

    // console.log('i made it here');
    // console.log(req.body.query);

    /* TODO request tweets from twitter */

    // const knexInstance = req.app.get('db');
    // tweetsService.getAlltweets(knexInstance)
    //   .then(tweets => res.json(tweets.map(serializeTweet)))
    //   .catch(next);
  })

module.exports = retrieveTweetsRouter;

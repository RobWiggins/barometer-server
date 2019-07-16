/* TODO RERIG UP TO ADJUST FOR TWEETS */
'use strict';

const express = require('express');
const knex = require('knex');
const path = require('path');
const tweetsService = require('../history/queries-service');
const xss = require('xss');
require('dotenv').config();
const OAuth = require('oauth');

const tweetRetriever = {

  tweet_path(query) {
    let encodedQuery = encodeURIComponent(query);
    let path = `https://api.twitter.com/1.1/search/tweets.json?q=${encodedQuery}&tweet_mode=extended&count=30&lang=en`;
    let token = process.env.OAUTH_ACCESS_TOKEN; 
    let secret = process.env.OAUTH_ACCESS_TOKEN_SECRET; 

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
          if ( returnedTweets.statuses.length === 0 ) {
            reject('tweets not found');
          } else {
            resolve(returnedTweets);
          }
        }
      });
    });
  },
};

module.exports = tweetRetriever;

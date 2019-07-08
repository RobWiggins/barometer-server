'use strict';

/* TODO RERIG UP TO ADJUST FOR TWEETS */

const express = require('express');
const knex = require('knex');
const path = require('path'); // need? join posix?
const tweetsService = require('./tweets-service');
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
  console.log(options);

  tweetRetriever.tweet_path(req.params.query).then(resolvedPromiseTweetData => {
    /* send tweets to watson api */
    emotionRetriever
      .fetchEmotions(resolvedPromiseTweetData, req.params.query)
      .then(analysisResults => {
        // ready tweet array to send to front end
        let statuses = resolvedPromiseTweetData.statuses;
        const tweetContentArr = emotionRetriever.getFullTextFromRT(statuses);
        console.log(JSON.stringify(analysisResults, null, 2));
        res.status(200).send({ watsonEmotionResults: analysisResults, tweetContentArr });
      })
      .catch(err => {
        console.log('error:', err);
      });
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

// tweetsService.getAlltweets(knexInstance)
//   .then(tweets => res.json(tweets.map(serializeTweet)))
//   .catch(next);

// .post(jsonBodyParser, (req, res, next) => {
//   const { title, content, folderid } = req.body;
//   const newTweet = { title, content };
//   if (!content) {
//     newTweet.content = '';
//   }
//   if (!title) {
//     return res.status(400).json({
//       error: { message: 'Missing title in required body' }, // TODO may need next to pick up error message
//     });
//   }
//   newTweet['folderid'] = parseInt(folderid);
//   tweetsService.insertNote(req.app.get('db'), newTweet)
//     .then(tweet => {
//       res
//         .status(201)
//         .location(path.posix.join(req.originalUrl, `/${tweet.id}`))
//         .json(serializeTweet(tweet));
//     })
//     .catch(next);
// })
// .patch(jsonBodyParser, (req, res, next) => {
//   const { title, content, noteId, folderId } = req.body;
//   // body requires noteId
//   const noteToUpdate = { title, content };

//   const numberOfValues = Object.values(noteToUpdate).filter(Boolean).length;
//   if (numberOfValues === 0)
//     return res.status(400).json({
//       error: {
//         message: 'Request body must contain either "title" or "content"',
//       },
//     });

//   const today = new Date();
//   noteToUpdate.modified = today;

//   tweetsService.updateNote(req.app.get('db'), parseInt(noteId), noteToUpdate)
//     .then(numRowsAffected => {
//       res.status(204).end();
//     })
//     .catch(next);
// })
// .delete(jsonBodyParser, (req, res, next) => {
//   let noteId = req.body.noteId;
//   tweetsService.deleteNote(req.app.get('db'), parseInt(noteId))
//     .then(() => res.status(204).end())
//     .catch(next);

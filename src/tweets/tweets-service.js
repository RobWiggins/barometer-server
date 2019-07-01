'use strict';

const tweetsService = {
  getAlltweets(knex) {
    return knex.select('*').from('tweets');
  },
  insertNote(knex, tweet) {
    return knex
      .insert(tweet)
      .into('tweets')
      .returning('*')
      .then(rows => rows[0]);
  },
  getNoteById(knex, tweetId) {
    return knex
      .select('*')
      .from('tweets')
      .where('id', tweetId)
      .first();
  },
  deleteNote(knex, tweetId) {
    return knex('tweets')
      .where('id', tweetId)
      .delete();
  },
  updateNote(knex, tweetId, newTweet) {
    return knex('tweets')
      .where('id', tweetId)
      .update(newTweet);
  },
};

module.exports = tweetsService;

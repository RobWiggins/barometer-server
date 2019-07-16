'use strict';

require('dotenv').config();
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');

const emotionRetriever = {
  fetchEmotions(tweetData, query) {
    let statuses = tweetData.statuses;
    const tweetContentArr = this.getFullTextFromRT(statuses);

    /* join tweets together into one paragraph for efficient fetch. */
    let uniqueTweetsArr = this.filterDuplicateTweets(tweetContentArr);
    const aggregateTweets = uniqueTweetsArr.join('. ');
    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
      version: '2019-07-01',
      iam_apikey: process.env.API_KEY,
      url: process.env.URL,
    });
    const analyzeParams = {
      text: aggregateTweets,
      features: {
        emotion: {
          targets: query.split(' '),
        },
        sentiment: {
          document: true,
        },
      },
    };
    return naturalLanguageUnderstanding.analyze(analyzeParams);
  },
  filterDuplicateTweets(duplicateTweets) {

    const seen = new Set();

    return duplicateTweets.filter(tweet => {
      const hash = tweet;
      if (seen.has(hash)) return false;

      seen.add(hash);
      return true;
    });
  },
  getFullTextFromRT(statuses) {
    let tweetContentArr = [];
    statuses.forEach(status => {
      tweetContentArr.push(
        status.full_text[0] + status.full_text[1] === 'RT'
          ? status.retweeted_status.full_text
          : status.full_text
      );
    });
    return tweetContentArr;
  }
};

module.exports = emotionRetriever;

'use strict';

require('dotenv').config();
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');

const emotionRetriever = {
  fetchEmotions(tweetData, query) {
    /* need to pass in query as targets max=2? for data considerations? mb */
    // let tweetDataJson = JSON.parse(tweetData);
    let statuses = tweetData.statuses;
    // console.log(statuses);
    // console.log(statuses);
    // const tweetContentArr = [];

    // full_text for retweets in diff field, if RT collect full text from original retweeted info
    const tweetContentArr = this.getFullTextFromRT(statuses);
    console.log(tweetContentArr);

    /* join tweets together into one paragraph for efficient fetch. */
    let uniqueTweetsArr = this.filterDuplicateTweets(tweetContentArr);
    // console.log(uniqueTweetsArr);
    const aggregateTweets = uniqueTweetsArr.join('. ');
    // console.log('SENT IN UNIQUE TWEETS FULL RT TEXT: ', aggregateTweets);
    /* TODO CHANGE THIS */

    // console.log(aggregateTweets);
    // console.log(aggregateTweets); // see what paragraph looks like
    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
      version: '2019-07-01',
      iam_apikey: process.env.API_KEY,
      url: process.env.URL,
    });
    /* insert the text of the tweets here */
    /* TODO FILTER FOR ONLY ENGLISH */
    /* WHAT TO DO ABOUT TARGETS WITH MULTIPLE WORDS */
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

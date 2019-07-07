'use strict';

require('dotenv').config();
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1');

const emotionRetriever = {
  fetchEmotions(tweetData, query) {
    /* need to pass in query as targets max=2? for data considerations? mb */
    // let tweetDataJson = JSON.parse(tweetData);
    let statuses = tweetData.statuses;
    // console.log(statuses);
    const tweetContentArr = [];
    statuses.forEach(status => tweetContentArr.push(status.full_text));
    // console.log(tweetContentArr); // see what array looks like
    /* join tweets together into one paragraph. */

    let uniqueTweetsArr = this.filterDuplicateTweets(tweetContentArr);
    // This isn't working, just remove RT's
    uniqueTweetsArr.splice(14);
    // console.log(uniqueTweetsArr);
    const aggregateTweets = uniqueTweetsArr.join('. ');
    /* TODO CHANGE THIS */ 
    
    console.log(aggregateTweets);
    // console.log(aggregateTweets); // see what paragraph looks like
    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
      version: '2019-07-01',
      iam_apikey: process.env.API_KEY,
      url: process.env.URL,
    });
    /* insert the text of the tweets here */
    /* TODO FILTER FOR ONLY ENGLISH */
    const analyzeParams = {
      text: aggregateTweets,
      features: {
        emotion: {
          targets: [query],
        },
        sentiment: {
          document: true,
        }
      },
    };
    return naturalLanguageUnderstanding.analyze(analyzeParams);
  },
  filterDuplicateTweets(tweetContentArr) {
    return Array.from(new Set(tweetContentArr));
  },
};

module.exports = emotionRetriever;

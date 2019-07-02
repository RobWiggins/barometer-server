'use strict';

require('dotenv').config();
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1');

const emotionRetriever = {
  fetchEmotions(tweetData) {
    /* need to pass in query as targets max=2? for data considerations? mb */

    let tweetDataJson = JSON.parse(tweetData);
    let statuses = tweetDataJson.statuses;

    const tweetContentArr = [];
    statuses.forEach(status => tweetContentArr.push(status.text));

    /* join tweets together into one paragraph. */
    const aggregateTweets = tweetContentArr.join('. ');
    console.log(aggregateTweets);

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
      version: '2019-07-01',
      iam_apikey: process.env.API_KEY,
      url: process.env.URL,
    });

    /* insert the text of the tweets here */
    const analyzeParams = {
      text: aggregateTweets,
      features: {
        emotion: {
          // document: false,
          targets: ['butterflies'],
        },
        // sentiment: true,
        // limit: 1,
      },
    };

    return naturalLanguageUnderstanding.analyze(analyzeParams);
    // .then(analysisResults => {
    //   console.log(JSON.stringify(analysisResults, null, 2));
    // })
    // .catch(err => {
    //   console.log('error:', err);
    // });
  },
};

module.exports = emotionRetriever;

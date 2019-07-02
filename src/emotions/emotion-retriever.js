'use strict';

require('dotenv').config();
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1');

function fetchEmotions(tweetData) {
  const jsonTweetData = JSON.stringify(tweetData);
  console.log(jsonTweetData);
  const statuses = jsonTweetData.statuses;
  const tweetContentArr = [];

  statuses.forEach(status => tweetContentArr.push(status.text));

  console.log(tweetContentArr);



}

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: '2019-07-01',
  iam_apikey: process.env.API_KEY,
  url: process.env.URL,
});

/* insert the text of the tweets here */
const analyzeParams = {
  text: 'a brown cow was so very happy',
  features: {
    keywords: {
      emotion: true,
      sentiment: true,
      // limit: 2,
    },
  },
};

naturalLanguageUnderstanding.analyze(analyzeParams)
  .then(analysisResults => {
    console.log(JSON.stringify(analysisResults, null, 2));
  })
  .catch(err => {
    console.log('error:', err);
  });


module.exports = fetchEmotions;
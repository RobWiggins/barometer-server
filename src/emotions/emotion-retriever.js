'use strict';

require('dotenv').config();
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1');

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: '2019-04-02',
  iam_apikey: process.env.API_KEY,
  url: process.env.URL,
});

const analyzeParams = {
  text: 'a brown cow was so very happy',
  features: {
    keywords: {
      emotion: true,
      sentiment: true,
      limit: 2,
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
'use strict';

require('dotenv').config();
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const emotionRetriever = {
  fetchEmotions(posts, query) {
    // let posts = postsData.data.map(post => post.text);

    /* join tweets together into one paragraph for efficient fetch. */
    let uniquePosts = this.filterDuplicatePosts(posts);
    const aggregratePosts = uniquePosts.join('. ');
    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
      version: '2022-04-07',
      authenticator: new IamAuthenticator({
        apikey: process.env.API_KEY
      }),
      serviceUrl: process.env.URL,
    });
    const analyzeParams = {
      text: aggregratePosts,
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
  filterDuplicatePosts(duplicatePosts) {

    const seen = new Set();

    return duplicatePosts.filter(post => {
      const hash = post;
      if (seen.has(hash)) return false;

      seen.add(hash);
      return true;
    });
  },
  getFullTextFromRT(posts) {
    let tweetContentArr = [];
    posts.forEach(post => {
      tweetContentArr.push(
        post.text[0] + post.text[1] === 'RT'
          ? post.retweeted_post.full_text
          : post.full_text
      );
    });
    return tweetContentArr;
  }
};

module.exports = emotionRetriever;

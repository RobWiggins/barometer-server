'use strict';

require('dotenv').config();

const tweetRetriever = {
  async tweet_path(query) {
    const BEARER_TOKEN = process.env.X_BEARER_TOKEN;

    if (!BEARER_TOKEN) {
      throw new Error('Missing X_BEARER_TOKEN');
    }

    const encodedQuery = encodeURIComponent(query);
    const params = new URLSearchParams({
      query: encodedQuery,
      max_results: '30',
    });

    const response = await fetch(
      `https://api.x.com/2/tweets/search/recent?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${BEARER_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`X API error ${response.status}: ${errorText}`);
    }

    const resJson = await response.json()
    const returnedPosts = resJson.data.map(post => post.text);

    return new Promise(function(resolve, reject) {
        if (returnedPosts.length === 0) {
          reject('No posts found');
        } else {
          resolve(returnedPosts);
        }
    });
  },
};

module.exports = tweetRetriever;

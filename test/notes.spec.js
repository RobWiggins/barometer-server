'use strict';

/* TODO INCOMPLETE TESTING tweets */

const app = require('../src/app');

before();

describe('Testing tweetsService and tweetsRouter', () => {
  it('GET /tweets responds with 200 containing all tweets', () => {
    return supertest(app)
      .get('/tweets')
      .expect(200, 'Hello, server and boilerplate!');
  });

  it()
});
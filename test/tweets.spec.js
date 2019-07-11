'use strict';

/* TODO INCOMPLETE TESTING tweets */

const app = require('../src/app');

// before();

describe('Testing tweetsRouter - tweet and watson API emotion calls', () => {
  it('GET /tweets/queries/:query responds with 200 containing all tweets', () => {
    return supertest(app)
      .get('/tweets/queries/dogs')
      .expect(200)
      .expect(res => {
        // console.log(res);
        expect(res.body.currentQuery).to.eql('dogs');
        expect(res.body.duplicatesFiltered.length > 1).to.eql(true);
        expect(typeof res.body.duplicatesFiltered[0]).to.eql('string');
        expect(res.body.watsonEmotionResults).to.not.eql(null);
      });
  });

  it('GET /tweets/invalidpath response with 404 not found') {
    return supertest(app)
      .get('/tweets/queries/dogs')
      .expect(404);
  }

  // it()
});
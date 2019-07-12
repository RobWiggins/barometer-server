'use strict';

const app = require('../src/app');

describe('Testing tweetsRouter - tweet and watson API emotion calls', () => {
  it('GET /tweets/queries/:query responds with 200 containing all tweets', () => {
    supertest(app)
      .get('/tweets/queries/dogs')
      .expect(200)
      .expect(res => {
        // console.log(res);
        expect(res.body.currentQuery).to.eql('dogs');
        expect(res.body.duplicatesFiltered.length > 1).to.eql(true);
        expect(typeof res.body.duplicatesFiltered[0]).to.eql('string');
        expect(res.body.watsonEmotionResults).to.not.be.null;
        expect(typeof res.body.watsonEmotionResults.emotion.targets[0].emotion.joy).to.eql('number');
      });
  });

  it('GET /tweets/invalidpath response with 404 not found', () => {
    supertest(app)
      .get('/tweets/invalidpath')
      .expect(404);
  });

});
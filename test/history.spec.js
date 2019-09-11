'use strict';

const knex = require('knex');
const app = require('../src/app');
const testHelpers = require('./test-helpers');

describe('Queries/History Endpoints', function() {
  let db;

  const testQueries = [
    { query: 'durant' },
    { query: 'house fire' },
    { query: 'tigers' },
  ];

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => testHelpers.cleanTables(db));

  describe('GET /queries/history', () => {
    context('Given three past queries, returns the three strings', () => {
      beforeEach('insert queries into queries table', () => {
        return Promise.all(testQueries.map(query => 
          testHelpers.seedQueriesTable(db, query)
        ));
      });

      afterEach('cleanup', () => testHelpers.cleanTables(db));

      it('responds with 200 and the query list', () => {
        return supertest(app)
          .get('/queries/history')
          .expect(200)
          .expect(res => {
            expect(res.body.queries.length).to.equal(3);
            expect(res.body.queries[0].query).to.equal('durant');
            expect(res.body.queries[2].query).to.equal('tigers');
          });
      });
    });
  });

  describe('POST /queries/history', () => {
    context(
      'Given three past queries, posting a query adds it to history',
      () => {
        beforeEach('insert queries into queries table', () => {
          return testQueries.forEach(query => {
            testHelpers.seedQueriesTable(db, query);
          });
        });

        afterEach('cleanup', () => testHelpers.cleanTables(db));

        const body = JSON.stringify({
          query: 'eagles',
        });
        const options = {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body,
        };

        it('responds with 201 and the query list', () => {
          supertest(app)
            .post('/queries/history', options)
            .expect(201)
            .expect(res => {
              expect(testHelpers.getAllQueries(db)).to.eql(4);
              expect(res.body.queries[3].query).to.eql('eagles');
            });
        });
      }
    );
  });
});

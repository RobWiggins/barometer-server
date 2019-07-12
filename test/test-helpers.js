'use strict';

const testHelpers = {
  cleanTables: function cleanTables(db) {
    // return db('barometer_test').truncate
    return db.raw(`TRUNCATE queries`);
  },
  seedQueriesTable: function seedQueriesTable(db, query) {
    // return db.into('queries').insert(queries);
    return db
      .insert(query)
      .into('queries')
      .returning('*')
      .then(rows => rows[0]);
  },
  getAllQueries: function getAllQueries(db) {
    return db('queries').select('*');
  }
};

module.exports = testHelpers;

'use strict';

const testHelpers = {
  cleanTables: function cleanTables(db) {
    return db.raw('TRUNCATE queries');
  },
  seedQueriesTable: function seedQueriesTable(db, query) {
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

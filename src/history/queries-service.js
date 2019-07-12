'use strict';

const queriesService = {
  getAllQueries(knex) {
    return knex.select('*').from('queries');
  },
  insertQuery(knex, query) {
    return knex
      .insert(query)
      .into('queries')
      .returning('*')
      .then(rows => rows[0]);
  },
  getQueryById(knex, id) {
    return knex
      .select('*')
      .from('queries')
      .where('id', id)
      .first();
  },
  deleteQuery(knex, id) {
    return knex('queries')
      .where('id', id)
      .delete();
  },
  updateQuery(knex, id, newQuery) {
    return knex('queries')
      .where('id', id)
      .update(newQuery);
  },
};

module.exports = queriesService;

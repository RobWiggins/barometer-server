'use strict';
const knex = require('knex');
const app = require('./app');
const { PORT, DB_URL, NODE_ENV } = require('./config');

const db = knex({
  client: 'pg',
  connection: {
    connectionString: DB_URL,
    ssl:
      NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
  },
});

app.set('db', db);

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
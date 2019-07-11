/* eslint-disable strict */
const { expect } = require('chai');
const supertest = require('supertest');
process.env.TZ = 'UTC';
process.env.NODE_ENV = 'test';

require('dotenv').config();

process.env.TEST_DB_URL =
  process.env.TEST_DB_URL ||
  'postgresql://barometer-guy:password@localhost/barometer_test';

global.expect = expect;
global.supertest = supertest;

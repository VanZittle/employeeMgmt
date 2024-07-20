const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432, // Default PostgreSQL port
  user: 'postgres',
  password: '', // Add your password here
  database: 'employees',
});

module.exports = pool;


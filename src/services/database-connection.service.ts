import { Pool } from 'pg';

const {
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_NAME,
} = process.env;

/**
 * Create new database connection pool.
 */
const pool = new Pool({
  host: DATABASE_HOST as string,
  port: Number.parseInt(DATABASE_PORT as string, 10) || 5432,
  user: DATABASE_USER as string,
  password: DATABASE_PASSWORD as string,
  database: DATABASE_NAME as string,
  // Maximum number of clients the pool should contain
  // by default this is set to 10.
  max: 100,
  // Number of milliseconds to wait before timing out when connecting a new client
  // by default this is 0 which means no timeout.
  connectionTimeoutMillis: 5_000,
});

export { pool as connectionPool };

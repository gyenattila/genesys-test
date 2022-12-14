require('dotenv-safe').config();

import express from 'express';
import cors from 'cors';

import { connectionPool } from './services/database-connection.service';
import { migrationExecutor } from './database/migration-executor-class';
import { errorHandler } from './middlewares/basic-error-handler.middleware';
import { authRouter, userRouter } from './routes';

/**
 * Initialize the express app.
 */
const app = express();

/**
 * Use the built in json parser middleware for parsing the incoming requests.
 */
app.use(express.json());

/**
 * Use cors to authenticate incoming requests.
 */
app.use(cors());

/**
 * Authentication routes for the user.
 */
app.use('/auth/', authRouter);

/**
 * Users routes.
 */
app.use('/users/', userRouter);

/**
 * Special error handling middleware function that return the error to the frontend in formatted way
 */
app.use(errorHandler);

/**
 * Start the application on port 3000 and listen for incoming requests.
 */
app.listen(process.env.WEBSITES_PORT || 3000, async () => {
  try {
    /** Connect to database. */
    await connectionPool.connect();
    console.log('Connected to database');

    /** Execute migrations. */
    migrationExecutor.runMigrations('genesys');

    console.log('The application is running');
  } catch (error) {
    console.log(`Error when connecting to database: ${error}`);
  }
});

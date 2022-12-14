require('dotenv-safe').config();

const { readFileSync, readdirSync } = require('fs');
const { join, isAbsolute } = require('path');
const { Client } = require('pg');

const {
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_NAME,
} = process.env;

const main = async () => {
  if (DATABASE_HOST !== 'localhost') {
    console.error(
      'Seeding is destructive, so only allowed in local environment'
    );
    process.exit(1);
  }

  /** Create new database connection client to postgres. */
  const client = createDbClient('postgres');
  await client.connect();

  console.log(`[Seed] Drop and re-create database ${DATABASE_NAME} ...`);
  await client.query(`DROP DATABASE IF EXISTS ${DATABASE_NAME}`);
  await client.query(`CREATE DATABASE ${DATABASE_NAME}`);
  await client.end();

  /** Create new database connection client to postgres. */
  const genesysClient = createDbClient(DATABASE_NAME);
  await genesysClient.connect();

  const schema = 'genesys';
  const defaultMigrationsFolder = join('..', '..', 'migrations');
  const defaultSeedsFolder = join('..', '..', 'seeds');

  await genesysClient.query(`CREATE SCHEMA ${schema};`);

  await genesysClient.query(`CREATE TABLE ${schema}.migrations (
    timestamp TIMESTAMP WITHOUT TIME ZONE DEFAULT current_timestamp,
    name VARCHAR
  )`);

  const migrationFiles = getQueryFilesFromFolder(defaultMigrationsFolder);
  const seedFiles = getQueryFilesFromFolder(defaultSeedsFolder);

  console.log('Running migrations.');
  await fileConsumer(schema, migrationFiles, genesysClient, true);

  console.log('Seeding database');
  await fileConsumer(schema, seedFiles, genesysClient, false);

  await genesysClient.end();
};

const fileConsumer = async (schema, files, dbClient, runMigration) => {
  for (const file of files) {
    try {
      console.log(`Running ${file.fileName} query.`);
      await executeMigration(schema, file, dbClient, runMigration);
      console.log(`Completed ${file.fileName} query`);
    } catch (error) {
      console.error(`Error while running the "${file.fileName}" query.`);
      throw error;
    }
  }
};

const getQueryFilesFromFolder = defaultFolder => {
  const absoluteFileFolder = isAbsolute(defaultFolder)
    ? defaultFolder
    : join(__dirname, defaultFolder);

  const queryFiles = readdirSync(absoluteFileFolder, {
    withFileTypes: true,
  })
    .filter(dirent => dirent.isFile() && dirent.name.endsWith('.sql'))
    .map(dirent => ({
      fileName: dirent.name,
      content: readFileSync(join(absoluteFileFolder, dirent.name), {
        encoding: 'utf-8',
      }),
    }));
  return queryFiles.sort((a, b) => (a.fileName < b.fileName ? -1 : 1));
};

const executeMigration = async (schema, file, dbClient, runMigration) => {
  /** Start a transaction */
  await dbClient.query('BEGIN');

  try {
    /** Execute migration file's content. */
    await dbClient.query(file.content);

    if (runMigration) {
      await dbClient.query(
        `INSERT INTO ${schema}.migrations (name) VALUES ($1::text);`,
        [file.fileName]
      );
    }

    /** Commit transaction */
    await dbClient.query('COMMIT');
  } catch (error) {
    /** Rollback transaction if some error happened during the transaction. */
    await dbClient.query('ROLLBACK');
    throw error;
  }
};

const createDbClient = database => {
  return new Client({
    host: DATABASE_HOST,
    port: Number.parseInt(DATABASE_PORT, 10) || 5432,
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database,
  });
};

(async () => {
  await main();
})();

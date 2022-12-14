import { readFileSync, readdirSync } from 'fs';
import { isAbsolute, join } from 'path';
import { QueryResult } from 'pg';

import { connectionPool } from '../services/database-connection.service';

export class MigrationExecutor {
  private readonly defaultMigrationsFolder = join('..', '..', 'migrations');

  /**
   * Run the migrations if the environment configuration allows to run it.
   */
  public async runMigrations(
    migrationTableSchema: string = 'genesys'
  ): Promise<void | undefined> {
    const shouldRunMigrations = process.env['DATABASE_MIGRATIONS'] === 'true';

    if (!shouldRunMigrations) {
      console.log(
        `Skipping migrations because "shouldRunMigrations" evaluated to false.`
      );
      return;
    }

    /** Ensure that the schema is exists. */
    await this.createSchemaIfNotExists(migrationTableSchema);

    /** Ensure migration table exists before we start the migrations. */
    await this.createMigrationsTableIfNotExists(migrationTableSchema);

    /** All existing migration files ordered by their name. */
    const migrationFiles = this.getMigrationFiles();

    /** The filename of the latest completed migration. */
    const latestMigrationFilename = await this.getLatestMigration(
      migrationTableSchema
    );

    /**
     * The position of the latest completed migration in the full list.
     * We can use the fact that they are alphabetically ordered.
     */
    const latestMigrationIndex = migrationFiles.findIndex(
      migration => migration.fileName === latestMigrationFilename
    );

    const pendingMigrations = latestMigrationFilename
      ? migrationFiles.slice(latestMigrationIndex + 1)
      : migrationFiles;

    console.log(`There are ${pendingMigrations.length} pending migrations.`);

    for (const migration of pendingMigrations) {
      try {
        console.log(`Running ${migration.fileName} migration.`);
        await this.executeMigration(migrationTableSchema, migration);
        console.log(`Completed ${migration.fileName} migration.`);
      } catch (error) {
        console.error(
          `Error while running the "${migration.fileName}" migration.`
        );
        throw error;
      }
    }
  }

  /**
   * Ensures that the schema is exists before running the migrations.
   * @param schema The schema to create if not exists.
   */
  private async createSchemaIfNotExists(schema: string) {
    console.log(schema);
    await connectionPool.query(`CREATE SCHEMA IF NOT EXISTS ${schema};`);
  }

  /**
   * Ensures the migration table exists in the target schema.
   * @param schema The schema to create the migrations table in.
   */
  private async createMigrationsTableIfNotExists(schema: string) {
    await connectionPool.query(`
    CREATE TABLE IF NOT EXISTS ${schema}.migrations (
      timestamp TIMESTAMP WITHOUT TIME ZONE DEFAULT current_timestamp,
      name VARCHAR
    )`);
  }

  /**
   *
   * @returns The sorted migration files by their filename.
   */
  private getMigrationFiles(): { fileName: string; content: string }[] {
    const absoluteMigrationFolder = this.getMigrationFolder();

    const migrationFiles = readdirSync(absoluteMigrationFolder, {
      withFileTypes: true,
    })
      .filter(dirent => dirent.isFile() && dirent.name.endsWith('.sql'))
      .map(dirent => ({
        fileName: dirent.name,
        content: readFileSync(join(absoluteMigrationFolder, dirent.name), {
          encoding: 'utf-8',
        }),
      }));
    return this.sortMigrationFiles(migrationFiles);
  }

  /**
   *
   * @returns The path to the migrations folder.
   */
  private getMigrationFolder(): string {
    return isAbsolute(this.defaultMigrationsFolder)
      ? this.defaultMigrationsFolder
      : join(__dirname, this.defaultMigrationsFolder);
  }

  /**
   *
   * @param migrationFiles The list of the sql migration files.
   * @returns The sorted list of the migration files.
   */
  private sortMigrationFiles<T>(
    migrationFiles: (T & { fileName: string })[]
  ): T[] {
    return migrationFiles.sort((a, b) => (a.fileName < b.fileName ? -1 : 1));
  }

  /**
   *
   * @param schema The schema to create the migrations table in.
   * @returns The last migration from the database which was executed.
   */
  private async getLatestMigration(
    schema: string
  ): Promise<string | undefined> {
    const { rows }: QueryResult<{ name: string }> = await connectionPool.query(`
      SELECT name 
      FROM ${schema}.migrations 
      ORDER BY timestamp DESC 
      LIMIT 1;
    `);

    return rows[0]?.name;
  }

  /**
   *
   * @param schema The schema to create the migrations table in.
   * @param migration The migration file with name and content provided.

   */
  private async executeMigration(
    schema: string,
    migration: { fileName: string; content: string }
  ) {
    /** Start a transaction */
    await connectionPool.query('BEGIN');

    try {
      /** Execute migration file's content. */
      await connectionPool.query(migration.content);

      await connectionPool.query(
        `INSERT INTO ${schema}.migrations (name) VALUES ($1::text);`,
        [migration.fileName]
      );

      /** Commit transaction */
      await connectionPool.query('COMMIT');
    } catch (error) {
      /** Rollback transaction if some error happened during the transaction. */
      await connectionPool.query('ROLLBACK');
      throw error;
    }
  }
}

export const migrationExecutor = new MigrationExecutor();

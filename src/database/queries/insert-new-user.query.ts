import { connectionPool } from '../../services/database-connection.service';

/**
 * Inserts new user entity into db.
 *
 * @param name The name of the user.
 * @param email The email of the user.
 * @param password The hashed password of the user.
 */
export const insertNewUserQuery = async (
  name: string,
  email: string,
  password: string
): Promise<void> => {
  await connectionPool.query(
    `INSERT INTO genesys.users (name, email, password)
    VALUES ($1, $2, $3)`,
    [name, email, password]
  );
};

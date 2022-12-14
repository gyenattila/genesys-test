import { QueryResult } from 'pg';

import { userAuthenticationParameters } from '../../interfaces';
import { connectionPool } from '../../services/database-connection.service';

/**
 *
 * @param email The email address of the user.
 * @returns The user's id and hashed password from the database.
 */
export const getUserIdPasswordFromDatabase = async (
  email: string
): Promise<userAuthenticationParameters | undefined> => {
  const { rows }: QueryResult<userAuthenticationParameters> =
    await connectionPool.query(
      `SELECT id, password FROM genesys.users WHERE email = $1`,
      [email]
    );

  return rows[0];
};

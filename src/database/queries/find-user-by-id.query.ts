import { QueryResult } from 'pg';

import { connectionPool } from '../../services/database-connection.service';
import { GetUserCredentialsInterface } from '../../interfaces';

/**
 * Finds a user via id.
 *
 * @param userId The user's identifier.
 * @returns The found user or undefined in case if the user is not in the database.
 */
export const findUserByIdQuery = async (
  userId: string
): Promise<GetUserCredentialsInterface | undefined> => {
  const { rows }: QueryResult<GetUserCredentialsInterface> =
    await connectionPool.query(
      `SELECT name, email, password FROM genesys.users WHERE id = $1`,
      [userId]
    );

  return rows[0];
};

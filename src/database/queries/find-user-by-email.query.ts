import { QueryResult } from 'pg';

import { connectionPool } from '../../services/database-connection.service';
import { GetUserByEmailInterface } from '../../interfaces';

/**
 * Find a specific user via email address.
 *
 * @param email The user's email address.
 * @returns Boolean value whether the user was found or not.
 */
export const findUserByEmailQuery = async (email: string): Promise<boolean> => {
  const { rows }: QueryResult<GetUserByEmailInterface> =
    await connectionPool.query(
      `SELECT email FROM genesys.users WHERE email = $1`,
      [email]
    );

  return rows[0]?.email ? true : false;
};

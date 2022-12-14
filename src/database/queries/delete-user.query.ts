import { QueryResult } from 'pg';

import { connectionPool } from '../../services/database-connection.service';
import { DeleteUserInterface } from '../../interfaces';

/**
 * Deletes the user from the database with the provided user id.
 *
 * @param userId The id pf the user
 * @returns The deleted user's name and email address if there was a user with the provided id, otherwise returns undefined
 */
export const deleteUserQuery = async (
  userId: string
): Promise<DeleteUserInterface | undefined> => {
  const { rows }: QueryResult<DeleteUserInterface> = await connectionPool.query(
    `DELETE FROM genesys.users WHERE id = $1 RETURNING name, email`,
    [userId]
  );

  return rows[0];
};

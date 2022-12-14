import { QueryResult } from 'pg';

import { connectionPool } from '../../services/database-connection.service';
import { GetAllUsersInterface } from '../../interfaces';

/**
 * Finds users from the database.
 */
export const getAllUsersQuery = async (): Promise<GetAllUsersInterface[]> => {
  const { rows }: QueryResult<GetAllUsersInterface> =
    await connectionPool.query(
      'SELECT name, email, last_login FROM genesys.users'
    );

  return rows;
};

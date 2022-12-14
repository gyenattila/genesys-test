import { connectionPool } from '../../services/database-connection.service';

/**
 * Updates the timestamp when the user logged in for the last time
 *
 * @param userId The user's identifier.
 */
export const updateLastLoginQuery = async (userId: number): Promise<void> => {
  await connectionPool.query(
    `UPDATE genesys.users SET last_login=current_timestamp WHERE id=$1`,
    [userId]
  );
};

import { connectionPool } from '../../services/database-connection.service';

/**
 * Updates the user's provided data.
 *
 * @param userId The user's id.
 * @param name The user's name to update.
 * @param email The user's email to update.
 */
export const updateUserDataQuery = async (
  userId: string,
  name: string,
  email: string
): Promise<void> => {
  await connectionPool.query(
    `UPDATE genesys.users SET name=$1, email=$2 WHERE id=$3;`,
    [name, email, userId]
  );
};

import { connectionPool } from '../../services/database-connection.service';

/**
 *
 * @param email The email address of the user.
 * @param hashedPassword The new generated and hashed password for the user.
 */
export const updateUserPasswordQuery = async (
  email: string,
  hashedPassword: string
): Promise<void> => {
  await connectionPool.query(
    `
    UPDATE genesys.users
    SET password = $1
    WHERE email = $2;
    `,
    [hashedPassword, email]
  );
};

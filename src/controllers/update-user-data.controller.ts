import { Request, Response, NextFunction } from 'express';

import { findUserByIdQuery } from '../database/queries';
import { updateUserDataQuery } from '../database/queries/update-user-data.query';
import { ForbiddenError, NotFoundError } from '../errors';
import { CustomRequest, GetUserCredentialsInterface } from '../interfaces';

/**
 * Updates the user with the provided user id.
 */
const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params as { [key: string]: string };
  const activeUserId = (req as CustomRequest).token.userId;

  if (activeUserId !== parseInt(userId, 10)) {
    return next(
      new ForbiddenError(`You have no permission to change this user's data`)
    );
  }

  const { name = undefined, email = undefined } =
    req.body as GetUserCredentialsInterface;

  const user = await findUserByIdQuery(userId);

  if (user === undefined) {
    return next(
      new NotFoundError(`User with the provided id: ${userId} was not found`)
    );
  }

  const nameToUpdate = name ?? user.name;
  const emailToUpdate = email ?? user.email;

  await updateUserDataQuery(userId, nameToUpdate, emailToUpdate);

  res
    .status(200)
    .json({ message: `User with id: "${userId}" updated successfully` });
};

export { updateUser as updateUserController };

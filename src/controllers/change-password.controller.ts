import { Request, Response, NextFunction } from 'express';

import { CustomRequest } from '../interfaces';
import { hashPassword, comparePasswords } from '../utils/password.util';
import { ForbiddenError } from '../errors';
import {
  getUserIdPasswordFromDatabase,
  updateUserPasswordQuery,
} from '../database/queries';
import { ChangePasswordPayload } from '../payloads';

const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, oldPassword, newPassword } = req.body as ChangePasswordPayload;
  const activeUserEmail = (req as CustomRequest).token.email;

  if (activeUserEmail !== email) {
    return next(
      new ForbiddenError(`You have no permission to change this user's data`)
    );
  }

  const userIdAndPasswordFromDb = await getUserIdPasswordFromDatabase(email);

  if (
    !(await comparePasswords(oldPassword, userIdAndPasswordFromDb!.password))
  ) {
    return next(new ForbiddenError('Invalid credentials provided'));
  }

  await updateUserPasswordQuery(email, await hashPassword(newPassword));

  res.json({ message: 'Password successfully changed.' });
};

export { changePassword as changePasswordController };

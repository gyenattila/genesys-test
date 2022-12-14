import { Request, Response, NextFunction } from 'express';
import { sign } from 'jsonwebtoken';

import { comparePasswords } from '../utils/password.util';
import { NotFoundError, ForbiddenError } from '../errors';
import { LoginUserPayload } from '../payloads';
import {
  getUserIdPasswordFromDatabase,
  updateLastLoginQuery,
} from '../database/queries';

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body as LoginUserPayload;

  const userIdAndPasswordFromDb = await getUserIdPasswordFromDatabase(email);

  if (userIdAndPasswordFromDb === undefined) {
    return next(
      new NotFoundError(`User with the provided email: ${email} not found`)
    );
  }

  const isValidPassword = await comparePasswords(
    password,
    userIdAndPasswordFromDb.password
  );

  if (!isValidPassword) {
    return next(new ForbiddenError(`The credentials are invalid`));
  }

  const token = sign(
    { userId: userIdAndPasswordFromDb.id, email },
    process.env['JSON_WEBTOKEN_SECRET'] as string,
    {
      expiresIn: '1h',
    }
  );

  await updateLastLoginQuery(userIdAndPasswordFromDb.id);

  res.status(200).json({ message: 'login', token });
};

export { loginUser as loginUserController };

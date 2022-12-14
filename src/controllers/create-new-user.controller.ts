import { Request, Response, NextFunction } from 'express';

import { CreateNewUserPayload } from '../payloads/';
import { findUserByEmailQuery } from '../database/queries';
import { UserAlreadyExistsError } from '../errors';
import { hashPassword } from '../utils/password.util';
import { insertNewUserQuery } from '../database/queries';

const createNewUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body as CreateNewUserPayload;

  const isUserExists = await findUserByEmailQuery(email);

  if (isUserExists) {
    return next(new UserAlreadyExistsError('User already exists'));
  }

  await insertNewUserQuery(name, email, await hashPassword(password));

  res.status(201).json({ message: 'user created' });
};

export { createNewUser as createNewUserController };

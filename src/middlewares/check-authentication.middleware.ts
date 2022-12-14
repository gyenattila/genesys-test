import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import { AuthorizationError, TokenExpiredError } from '../errors';
import { CustomRequest } from '../interfaces';

export const checkAuthentication = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1]; // Authorization: 'Bearer <token>'

  if (token === undefined) {
    return next(new AuthorizationError('Authentication failed'));
  }

  try {
    const decodedToken = verify(
      token,
      process.env['JSON_WEBTOKEN_SECRET'] as string
    ) as { userId: string; email: string };

    (req as CustomRequest).token = decodedToken;
    next();
  } catch (_) {
    return next(new TokenExpiredError('The token has expired'));
  }
};

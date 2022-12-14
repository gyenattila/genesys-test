import { Request, Response, NextFunction } from 'express';

import { BaseError } from '../errors';

export const errorHandler = async (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (error instanceof BaseError) {
    return res
      .status(error.statusCode)
      .json({ errors: error.serializeErrors() });
  }

  return res.status(500).json({ errors: 'An unknown error occurred!' });
};

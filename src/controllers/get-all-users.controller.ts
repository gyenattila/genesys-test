import { Request, Response, NextFunction } from 'express';

import { getAllUsersQuery } from '../database/queries';

const getAllUsers = async (
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const users = await getAllUsersQuery();
  res.status(200).json({ users });
};

export { getAllUsers as getAllUsersController };

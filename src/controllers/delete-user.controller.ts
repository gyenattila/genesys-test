import { Request, Response, NextFunction } from 'express';
import { deleteUserQuery } from '../database/queries';
import { NotFoundError } from '../errors';

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userId }: { [key: string]: string } = req.params;

  const deletedUser = await deleteUserQuery(userId);

  if (deletedUser === undefined) {
    return next(
      new NotFoundError(`User with the provided id: ${userId} was not found`)
    );
  }

  res.status(200).json({
    message: `User with name: "${deletedUser.name}" and email: "${deletedUser.email}" was deleted successfully`,
  });
};

export { deleteUser as deletedUserController };

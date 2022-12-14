import { Router } from 'express';

import { checkAuthentication } from '../middlewares';
import { getAllUsersController } from '../controllers/get-all-users.controller';
import { createNewUserController } from '../controllers/create-new-user.controller';
import { createNewUserSchemaValidation } from '../validators';
import { deletedUserController } from '../controllers/delete-user.controller';
import { updateUserController } from '../controllers/update-user-data.controller';

const router = Router();

/**
 * Get users.
 */
router.get('/', checkAuthentication, getAllUsersController);

/**
 * Create new user.
 */
router.post('/', createNewUserSchemaValidation, createNewUserController);

/**
 * Update existing users data.
 */
router.patch('/:userId', checkAuthentication, updateUserController);

/**
 * Delete user with the provided userId.
 */
router.delete('/:userId', checkAuthentication, deletedUserController);

export { router as userRouter };

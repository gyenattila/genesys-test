import { Router } from 'express';

import { loginUserController } from '../controllers/login.controller';
import { changePasswordController } from '../controllers/change-password.controller';
import {
  loginSchemaValidation,
  changePasswordSchemaValidation,
} from '../validators';
import { checkAuthentication } from '../middlewares';

const router = Router();

router.post('/login', loginSchemaValidation, loginUserController);

router.post(
  '/change-password',
  checkAuthentication,
  changePasswordSchemaValidation,
  changePasswordController
);

export { router as authRouter };

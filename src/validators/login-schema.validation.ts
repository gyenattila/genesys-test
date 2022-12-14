import { check } from 'express-validator';

import { validator } from './validator';

export const loginSchemaValidation = [
  check('email')
    .normalizeEmail()
    .isEmail()
    .withMessage('Email must be valid email.'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Password must be provided.'),
  validator,
];

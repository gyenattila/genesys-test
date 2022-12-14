import { check } from 'express-validator';

import { validator } from './validator';

export const createNewUserSchemaValidation = [
  check('name')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Username is must be provided'),
  check('email')
    .normalizeEmail()
    .isEmail()
    .withMessage('Email must be valid email.'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Password must be provided.'),
  validator,
];

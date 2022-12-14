import { check } from 'express-validator';

import { validator } from './validator';

export const changePasswordSchemaValidation = [
  check('email')
    .normalizeEmail()
    .isEmail()
    .withMessage('Email must be valid email.'),
  check('oldPassword')
    .exists({ checkFalsy: true })
    .withMessage('Password must be provided.'),
  check('newPassword')
    .trim()
    .isLength({ min: 8 })
    .withMessage('New password must be at 8 characters long.'),
  check('newPassword').custom((value: string, { req }) => {
    if (value !== req.body.newPasswordConfirm) {
      throw new Error('Password confirmation does not match.');
    }
    return true;
  }),
  validator,
];

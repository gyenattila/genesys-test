import { BaseError } from './base.error';

export class AuthorizationError extends BaseError {
  statusCode = 401;

  constructor(private errorMessage: string) {
    super(errorMessage);

    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }

  serializeErrors() {
    return [{ message: this.errorMessage }];
  }
}

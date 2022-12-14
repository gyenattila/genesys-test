import { BaseError } from './base.error';

export class TokenExpiredError extends BaseError {
  statusCode = 401;

  constructor(private errorMessage: string) {
    super(errorMessage);

    Object.setPrototypeOf(this, TokenExpiredError.prototype);
  }

  serializeErrors() {
    return [{ message: this.errorMessage }];
  }
}

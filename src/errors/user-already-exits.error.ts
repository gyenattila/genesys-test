import { BaseError } from './base.error';

export class UserAlreadyExistsError extends BaseError {
  statusCode = 409;

  constructor(private errorMessage: string) {
    super(errorMessage);

    Object.setPrototypeOf(this, UserAlreadyExistsError.prototype);
  }

  serializeErrors() {
    return [{ message: this.errorMessage }];
  }
}

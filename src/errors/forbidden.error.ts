import { BaseError } from './base.error';

export class ForbiddenError extends BaseError {
  statusCode = 403;

  constructor(private errorMessage: string) {
    super(errorMessage);

    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }

  serializeErrors() {
    return [{ message: this.errorMessage }];
  }
}

import { BaseError } from './base.error';

export class NotFoundError extends BaseError {
  statusCode = 404;

  constructor(private errorMessage: string) {
    super(errorMessage);

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: this.errorMessage }];
  }
}

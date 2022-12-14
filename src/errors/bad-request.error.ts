import { BaseError } from './base.error';

export class BadRequestError extends BaseError {
  statusCode = 400;

  constructor(private errorMessage: string) {
    super(errorMessage);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    return [{ message: this.errorMessage }];
  }
}

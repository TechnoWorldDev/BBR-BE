import { Error } from '../model/error';

export class ValidationException extends Error {
  readonly details: Error[];

  constructor(message: string, details: Error[]) {
    super(message);
    this.details = details;
    Object.setPrototypeOf(this, ValidationException.prototype);
  }

  public static inputNotValid(target: string, message: string): never {
    const errorDetail = new Error('InputValidationError', message, target, [], undefined);
    throw new ValidationException('Passed arguments are not valid', [errorDetail]);
  }

  getDetails(): Error[] {
    return this.details;
  }
}

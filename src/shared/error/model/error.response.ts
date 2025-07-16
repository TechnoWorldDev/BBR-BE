import { Error } from './error';

export class ErrorResponse {
  public error: Error;

  constructor(error: Error) {
    this.error = error;
  }
}

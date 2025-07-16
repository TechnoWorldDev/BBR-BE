/* eslint-disable prettier/prettier */
import { InnerError } from './inner-error';

export class Error {
  code?: string;
  message?: string;
  target?: string;
  details?: Error[];
  innererror?: InnerError;

  constructor(
    code?: string,
    message?: string,
    target?: string,
    details?: Error[],
    innererror?: Innererror
  ) {
    this.code = code;
    this.message = message;
    this.target = target;
    this.details = details;
    this.innererror = innererror;
  }
}

export interface Innererror {
  code?: string;
  innererror?: Innererror;
}

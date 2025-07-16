import { HttpStatus } from '@nestjs/common';
import { ErrorSpecification, getErrorSpecificationDetails } from '../specs/error-specification';

export class LogicalException extends Error {
  public errorSpecification: ErrorSpecification;

  constructor(message: string, errorSpecification: ErrorSpecification, cause?: Error) {
    super(message);
    this.errorSpecification = errorSpecification;
    if (cause) {
      this.stack += `\nCaused by: ${cause.stack}`;
    }
    Object.setPrototypeOf(this, LogicalException.prototype);
  }

  getHttpStatus(): HttpStatus {
    return getErrorSpecificationDetails(this.errorSpecification).status || HttpStatus.BAD_REQUEST;
  }
}

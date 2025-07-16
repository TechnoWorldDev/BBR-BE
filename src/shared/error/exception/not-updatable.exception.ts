import { ErrorSpecification } from '../specs/error-specification';
import { LogicalException } from './logical.exception';

export class NotUpdatableException extends LogicalException {
  private constructor(errorSpecification: ErrorSpecification, cause?: Error) {
    super('Not updatable', errorSpecification, cause);
  }

  public static notUpdatableException(
    errorSpecification: ErrorSpecification
  ): NotUpdatableException {
    return new NotUpdatableException(errorSpecification);
  }

  public static notUpdatableExceptionWithError(
    errorSpecification: ErrorSpecification,
    cause: Error
  ): NotUpdatableException {
    return new NotUpdatableException(errorSpecification, cause);
  }
}

import { ErrorSpecification } from '../specs/error-specification';
import { LogicalException } from './logical.exception';

export class NotUpdatedException extends LogicalException {
  private constructor(errorSpecification: ErrorSpecification, cause?: Error) {
    super('Not updated', errorSpecification, cause);
  }

  public static notUpdatedException(errorSpecification: ErrorSpecification): NotUpdatedException {
    return new NotUpdatedException(errorSpecification);
  }

  public static notUpdatedExceptionWithError(
    errorSpecification: ErrorSpecification,
    cause: Error
  ): NotUpdatedException {
    return new NotUpdatedException(errorSpecification, cause);
  }
}

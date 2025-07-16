import { ErrorSpecification } from '../specs/error-specification';
import { LogicalException } from './logical.exception';

export class NotSavedException extends LogicalException {
  private constructor(errorSpecification: ErrorSpecification) {
    super('Not saved', errorSpecification);
  }

  public static notSavedException(errorSpecification: ErrorSpecification): NotSavedException {
    return new NotSavedException(errorSpecification);
  }
}

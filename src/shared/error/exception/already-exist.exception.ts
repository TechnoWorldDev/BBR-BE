/* eslint-disable prettier/prettier */
import { LogicalException } from './logical.exception';
import { ErrorSpecification } from '../specs/error-specification';

export class AlreadyExistsException extends LogicalException {
  public id?: string;

  private constructor(message: string, errorSpecification: ErrorSpecification) {
    super(message, errorSpecification);
  }

  public static alreadyExistsException(
    id: string,
    errorSpecification: ErrorSpecification
  ): AlreadyExistsException {
    const exception = new AlreadyExistsException(
      `Already exists with id: ${id}`,
      errorSpecification
    );
    exception.id = id;
    return exception;
  }

  public static alreadyExistsExceptionWithCode(
    code: string,
    errorSpecification: ErrorSpecification
  ): AlreadyExistsException {
    return new AlreadyExistsException(`Already exists with: ${code}`, errorSpecification);
  }

  public static alreadyExistsExceptionWithoutField(
    errorSpecification: ErrorSpecification
  ): AlreadyExistsException {
    return new AlreadyExistsException('Already exists with same attributes.', errorSpecification);
  }
}

import { ErrorSpecification } from '../specs/error-specification';
import { LogicalException } from './logical.exception';

export class BadCredentialException extends LogicalException {
  private constructor(errorSpecification: ErrorSpecification) {
    super('Given credentials are not valid', errorSpecification);
  }

  public static badCredentialException(): BadCredentialException {
    return new BadCredentialException(ErrorSpecification.BAD_CREDENTIALS_ERROR);
  }
}

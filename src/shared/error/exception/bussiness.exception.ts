import { ErrorSpecification } from '../specs/error-specification';
import { LogicalException } from './logical.exception';

export class BusinessException extends LogicalException {
  constructor(message: string, errorSpecification: ErrorSpecification, cause?: Error) {
    super(message, errorSpecification, cause);
  }
}

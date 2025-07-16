import { ErrorSpecification } from '../specs/error-specification';
import { LogicalException } from './logical.exception';

export class NotFoundByIdException extends LogicalException {
  public id?: string | string[] | null;

  private constructor(message: string, errorSpecification: ErrorSpecification) {
    super(message, errorSpecification);
  }

  public static notFoundByIdException(
    id: string,
    errorSpecification: ErrorSpecification
  ): NotFoundByIdException {
    return new NotFoundByIdException(`Not found. Given id: ${id}`, errorSpecification);
  }

  public static notFoundByIdsException(
    ids: string[] | null,
    errorSpecification: ErrorSpecification
  ): NotFoundByIdException {
    const idsString = ids === null ? 'null' : ids.join(', ');
    return new NotFoundByIdException(`Not found. Given ids: ${idsString}`, errorSpecification);
  }
}

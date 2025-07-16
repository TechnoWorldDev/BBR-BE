export enum ErrorResponseConstants {
  METHOD_ARGUMENT_NOT_VALID_EXCEPTION = 'MethodArgumentValidation',
}

export const ErrorResponseConstantsMap: Record<
  ErrorResponseConstants,
  { code: string; message: string }
> = {
  [ErrorResponseConstants.METHOD_ARGUMENT_NOT_VALID_EXCEPTION]: {
    code: 'MethodArgumentValidation',
    message: 'Passed arguments are not valid',
  },
};

export const getErrorResponseConstantsDetails = (constant: ErrorResponseConstants) => {
  return ErrorResponseConstantsMap[constant];
};

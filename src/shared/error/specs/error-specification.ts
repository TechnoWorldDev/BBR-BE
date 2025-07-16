import { HttpStatus } from '@nestjs/common';

export enum ErrorSpecification {
  USER_NOT_FOUND = 'UserNotFound',
  USER_EMAIL_ALREADY_EXISTS = 'UserEmailAlreadyExists',
  USER_NOT_DELETABLE = 'UserNotDeletable',
  USER_NOT_SAVED = 'UserNotSaved',
  RESET_TOKEN_NOT_FOUND = 'ResetTokenNotFound',
  RESET_TOKEN_EXPIRED = 'ResetTokenExpired',
  CONFIRM_PASSWORD_BAD_REQUEST = 'ConfirmPasswordBadRequest',
  NEW_PASSWORD_BAD_REQUEST = 'NewPasswordBadRequest',
  UNKNOWN = 'Unknown',
  ALREADY_EXIST = 'AlreadyExist',
  MEDIA_MAX_UPLOAD_SIZE_EXCEEDED = 'MediaMaxUploadSizeExceeded',
  BAD_CREDENTIALS_ERROR = 'BadCredentials',
}

export const ErrorSpecificationMap: Record<
  ErrorSpecification,
  { code: string; target: string; status?: HttpStatus }
> = {
  [ErrorSpecification.USER_NOT_FOUND]: {
    code: 'UserNotFound',
    target: 'User',
    status: HttpStatus.NOT_FOUND,
  },
  [ErrorSpecification.USER_EMAIL_ALREADY_EXISTS]: {
    code: 'UserEmailAlreadyExists',
    target: 'Email',
    status: HttpStatus.CONFLICT,
  },
  [ErrorSpecification.USER_NOT_DELETABLE]: {
    code: 'UserNotDeletable',
    target: 'User',
  },
  [ErrorSpecification.USER_NOT_SAVED]: {
    code: 'UserNotSaved',
    target: 'User',
  },
  [ErrorSpecification.RESET_TOKEN_NOT_FOUND]: {
    code: 'ResetTokenNotFound',
    target: 'ResetToken',
    status: HttpStatus.NOT_FOUND,
  },
  [ErrorSpecification.RESET_TOKEN_EXPIRED]: {
    code: 'ResetTokenExpired',
    target: 'ResetToken',
  },
  [ErrorSpecification.CONFIRM_PASSWORD_BAD_REQUEST]: {
    code: 'ConfirmPasswordBadRequest',
    target: 'Common',
  },
  [ErrorSpecification.NEW_PASSWORD_BAD_REQUEST]: {
    code: 'NewPasswordBadRequest',
    target: 'Common',
  },
  [ErrorSpecification.UNKNOWN]: {
    code: 'Unknown',
    target: 'Common',
  },
  [ErrorSpecification.ALREADY_EXIST]: {
    code: 'AlreadyExist',
    target: 'Common',
  },
  [ErrorSpecification.MEDIA_MAX_UPLOAD_SIZE_EXCEEDED]: {
    code: 'MediaMaxUploadSizeExceeded',
    target: 'Media',
  },
  [ErrorSpecification.BAD_CREDENTIALS_ERROR]: {
    code: 'BadCredentials',
    target: 'Credentials',
    status: HttpStatus.UNAUTHORIZED,
  },
};

export const getErrorSpecificationDetails = (error: ErrorSpecification) => {
  return ErrorSpecificationMap[error];
};

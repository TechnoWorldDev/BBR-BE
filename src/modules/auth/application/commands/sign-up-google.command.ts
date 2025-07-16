import { SignupMethodEnum } from 'src/shared/types/signup-method.enum';

export class SignUpGoogleCommand {
  constructor(
    public readonly email: string,
    public readonly fullName: string,
    public readonly signupMethod: SignupMethodEnum,
    public readonly emailVerified: boolean,
    public readonly roleId: string
  ) {}
}

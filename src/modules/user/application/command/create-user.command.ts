import { SignupMethodEnum } from 'src/shared/types/signup-method.enum';

export class CreateUserCommand {
  constructor(
    public readonly fullName: string,
    public readonly email: string,
    public readonly password: string,
    public readonly roleId: string,
    public readonly signupMethod: SignupMethodEnum,
    public readonly emailNotifications?: boolean,
    public readonly createdBy?: string
  ) {}
}

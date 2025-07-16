import { SignupMethodEnum } from 'src/shared/types/signup-method.enum';

export class UpdateUserCommand {
  constructor(
    public readonly id: string,
    public readonly fullName: string,
    public readonly email: string,
    public readonly roleId: string,
    public readonly password: string,
    public readonly signupMethod?: SignupMethodEnum,
    public readonly emailNotifications?: boolean
  ) {}
}

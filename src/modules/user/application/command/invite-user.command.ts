export class InviteUserCommand {
  constructor(
    public readonly email: string,
    public readonly role: string,
    public readonly tempPassword: string,
    public readonly createdBy: string
  ) {}
}

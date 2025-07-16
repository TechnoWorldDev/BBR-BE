export class SendInviteEmailCommand {
  constructor(
    public readonly email: string,
    public readonly inviteLink: string,
    public readonly tempPassword: string
  ) {}
}

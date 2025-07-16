export class AcceptInviteCommand {
  constructor(
    public readonly token: string,
    public readonly password: string
  ) {}
}

export class UpdateUserStatusCommand {
  constructor(
    public readonly id: string,
    public readonly status: string
  ) {}
}

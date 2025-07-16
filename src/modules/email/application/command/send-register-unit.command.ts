export class SendRegisterUnitCommand {
  constructor(
    public readonly to: string,
    public readonly fullName: string,
    public readonly unitName: string,
    public readonly manageResidencesLink: string
  ) {}
}

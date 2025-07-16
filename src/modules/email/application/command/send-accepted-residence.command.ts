export class SendAcceptedResidenceCommand {
  constructor(
    public readonly to: string,
    public readonly fullName: string,
    public readonly residenceName: string,
    public readonly manageResidencesLink: string
  ) {}
}

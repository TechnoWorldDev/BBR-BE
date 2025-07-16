export class CreatePositionRequestCommand {
  constructor(
    public readonly residenceId: string,
    public readonly rankingCategoryId: string,
    public readonly requestedBy: string
  ) {}
}

export class CreateRankingCriteriaCommand {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly isDefault: boolean
  ) {}
}

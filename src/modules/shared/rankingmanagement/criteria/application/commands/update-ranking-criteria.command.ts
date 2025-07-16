export class UpdateRankingCriteriaCommand {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly isDefault: boolean
  ) {}
}

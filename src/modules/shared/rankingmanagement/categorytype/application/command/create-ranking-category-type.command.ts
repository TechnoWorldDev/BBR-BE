export class CreateRankingCategoryTypeCommand {
  constructor(
    public readonly name: string,
    public readonly key: string
  ) {}
}

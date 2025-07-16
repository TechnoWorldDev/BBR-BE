export class ScoreResidenceCommand {
  constructor(
    public readonly residenceId: string,
    public readonly scores: { rankingCriteriaId: string; score: number }[]
  ) {}
}

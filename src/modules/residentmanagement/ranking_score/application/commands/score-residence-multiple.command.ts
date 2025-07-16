export class ScoreMultipleResidencesCommand {
  constructor(
    public readonly items: {
      residenceId: string;
      scores: { rankingCriteriaId: string; score: number }[];
    }[]
  ) {}
}

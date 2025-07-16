
export class ResidenceResponse {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly status: string,
    public readonly developmentStatus: string,
    public readonly subtitle: string,
    public readonly description: string,
    public readonly budgetStartRange: number,
    public readonly budgetEndRange: number,
    public readonly address: string,
    public readonly longitude: string,
    public readonly latitude: string
  ) {}
}

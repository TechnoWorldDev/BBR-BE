export class UpdateLifestyleCommand {
  constructor(
    public readonly id: string,
    public readonly name?: string,
    public readonly order?: number
  ) {}
}

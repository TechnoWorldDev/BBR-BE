export class CreateContinentCommand {
  constructor(
    public readonly name: string,
    public readonly code: string
  ) {}
}

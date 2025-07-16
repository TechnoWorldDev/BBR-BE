export class CreateAmenityCommand {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly iconId: string,
    public readonly featuredImageId: string
  ) {}
}

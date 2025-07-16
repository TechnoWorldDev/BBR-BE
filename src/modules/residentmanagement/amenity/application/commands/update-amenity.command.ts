export class UpdateAmenityCommand {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly iconId: string,
    public readonly featuredImageId: string
  ) {}
}

export class CreateBrandTypesCommand {
  constructor(
    public readonly name: string,
    public readonly description: string
  ) {}
}

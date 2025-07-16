export class UpdateBrandStatusCommand {
  constructor(
    public readonly id: string,
    public readonly status: string
  ) {}
}

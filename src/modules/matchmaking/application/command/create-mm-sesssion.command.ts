export class CreateMMSessionCommand {
  constructor(
    public readonly userId: string,
    public readonly metadata: any
  ) {}
}

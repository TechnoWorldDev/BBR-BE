export class AddFavoriteCommand {
  constructor(
    public readonly entityId: string,
    public readonly entityType: string
  ) {}
}

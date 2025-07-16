export class RemoveFavoriteCommand {
  constructor(
    public readonly entityType: string,
    public readonly entityId: string
  ) {}
}

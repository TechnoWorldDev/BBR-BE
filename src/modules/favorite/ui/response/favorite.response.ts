export class FavoriteResponse {
  constructor(
    public readonly id: string,
    public readonly entity: any,
    public readonly entityType: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}

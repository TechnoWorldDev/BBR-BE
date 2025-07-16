import { OrderByDirection } from 'objection';

export class BaseFetchQuery {
  constructor(
    public readonly searchQuery?: string,
    public readonly page: number = 1,
    public readonly limit: number = 10,
    public readonly sortBy?: string, // Column to sort by (e.g., 'name', 'type', 'status', 'registered_at')
    public readonly sortOrder?: OrderByDirection // Sort direction
  ) {}
}

import { QueryBuilder, Model } from 'objection';

export function applySearchFilter<T extends Model, R>(
  query: QueryBuilder<T, R>,
  searchQuery: string | undefined,
  columns: string[]
): QueryBuilder<T, R> {
  if (!searchQuery || columns.length === 0) return query;
  const searchTerm = `%${searchQuery}%`;
  return query.where(function (this: QueryBuilder<T, R>) {
    columns.forEach((column, index) => {
      if (index === 0) {
        this.whereRaw(`CAST(${column} AS TEXT) ILIKE ?`, [searchTerm]);
      } else {
        this.orWhereRaw(`CAST(${column} AS TEXT) ILIKE ?`, [searchTerm]);
      }
    });
  });
}

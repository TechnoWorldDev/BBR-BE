import { Model, QueryBuilder } from 'objection';
import { validate as isValidUUID } from 'uuid';

type ComparisonOperators = {
  gt?: number;
  lt?: number;
  gte?: number;
  lte?: number;
  ne?: number | string;
  eq?: number | string;
};

type FilterValue =
  | string
  | number
  | boolean
  | Array<string | number>
  | ComparisonOperators;

type FilterConfig<T> = {
  [K in keyof T]?: FilterValue;
};

export function applyFilters<T extends Model>(
  query: QueryBuilder<T, T[]>,
  filters: FilterConfig<T>,
  alias?: string
): QueryBuilder<T, T[]> {
  Object.entries(filters).forEach(([key, value]) => {
    const column = alias ? `${alias}.${key}` : key;

    // ✅ Handle range/object filters like { gt: 100, lt: 500 }
    if (
      typeof value === 'object' &&
      !Array.isArray(value) &&
      value !== null &&
      Object.keys(value).some((k) =>
        ['gt', 'lt', 'gte', 'lte', 'ne', 'eq'].includes(k)
      )
    ) {
      const operatorMap: Record<string, string> = {
        gt: '>',
        lt: '<',
        gte: '>=',
        lte: '<=',
        ne: '!=',
        eq: '=',
      };

      Object.entries(value).forEach(([op, val]) => {
        const operator = operatorMap[op];
        if (operator && val !== undefined && val !== null) {
          query.where(column, operator as any, val as any);
        }
      });

      return;
    }

    // ✅ Handle array values (e.g. status: ['ACTIVE', 'INACTIVE'])
    if (Array.isArray(value)) {
      const validValues = value.filter((v) => {
        if (
          (key.toLowerCase().endsWith('id') || key.toLowerCase() === 'id') &&
          typeof v === 'string'
        ) {
          return isValidUUID(v);
        }
        return true;
      });

      if (validValues.length) {
        query.whereIn(column, validValues);
      }
    }
    // ✅ Handle simple values
    else if (value !== undefined && value !== null) {
      if (
        (key.toLowerCase().endsWith('id') || key.toLowerCase() === 'id') &&
        typeof value === 'string' &&
        !isValidUUID(value)
      ) {
        return; // skip invalid uuid
      }

      query.where(column, value);
    }
  });

  return query;
}

type RangeFilter = {
  gt?: number | string;
  gte?: number | string;
  lt?: number | string;
  lte?: number | string;
  eq?: number | string | boolean;
};

type FilterValue = string | number | boolean | Array<string | number> | RangeFilter;

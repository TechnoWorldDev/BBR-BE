export async function applyPagination(
  query: any,
  page = 1,
  limit = 10,
  distinctColumn?: string // <— нови аргумент
) {
  const offset = (page - 1) * limit;

  // 1) COUNT: ако је prosleđen distinctColumn, бројимо DISTINCT, иначе радимо COUNT(*)
  let countQb = query.clone().clearSelect().clearOrder();
  if (distinctColumn) {
    countQb = countQb.countDistinct(`${distinctColumn} as total`);
  } else {
    countQb = countQb.count('* as total');
  }

  const totalResult = (await countQb.first()) as { total: string };
  const totalCount = Number(totalResult.total);
  const totalPages = Math.ceil(totalCount / limit);

  // 2) DATA
  const paginatedQuery = await query.clone().limit(limit).offset(offset);

  return { paginatedQuery, totalCount, totalPages };
}

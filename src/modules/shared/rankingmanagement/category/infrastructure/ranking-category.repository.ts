import { IRankingCategoryRepository } from '../domain/ranking-category.repository.interface';
import { RankingCategory } from '../domain/ranking-category.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { KnexService } from '../../../../../shared/infrastructure/database/knex.service';
import { FetchRankingCategoriesQuery } from '../application/command/fetch-ranking.categories.query';
import { PaginationResponse } from '../../../../../shared/ui/response/pagination.response';
import { applyPagination } from '../../../../../shared/utils/pagination.util';
import { applySearchFilter } from 'src/shared/filters/query.search-filter';
import { applyFilters } from 'src/shared/filters/query.dynamic-filters';
import { randomUUID } from 'crypto';
import { Residence } from 'src/modules/residentmanagement/residence/domain/residence.entity';
import { FetchResidencesByCategoryQuery } from '../application/command/fetch-residences-by-category.query';
import { ResidenceStatusEnum } from 'src/modules/residentmanagement/residence/domain/residence-status.enum';
import { User } from 'src/modules/user/domain/user.entity';
import { ResidencePositionRequestStatusEnum } from 'src/shared/types/residence-position-requests.enum';

@Injectable()
export class RankingCategoryRepositoryImpl implements IRankingCategoryRepository {
  constructor(private readonly knexService: KnexService) {}

  async create(rankingCategory: Partial<RankingCategory>): Promise<RankingCategory | undefined> {
    const rankingCategoryData = {
      name: rankingCategory.name,
      slug: rankingCategory.slug,
      title: rankingCategory.title,
      description: rankingCategory.description,
      rankingCategoryTypeId: rankingCategory.rankingCategoryType?.id,
      residenceLimitation: rankingCategory.residenceLimitation,
      rankingPrice: rankingCategory.rankingPrice,
      featuredImageId: rankingCategory.featuredImage?.id,
      status: rankingCategory.status,
      entityId: rankingCategory.entityId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const knex = this.knexService.connection;

    const insertedRankingCategory = await knex('ranking_categories')
      .insert(rankingCategoryData)
      .returning('*');

    return this.findById(insertedRankingCategory[0].id);
  }

  async findById(id: string): Promise<RankingCategory | undefined> {
    const category = await RankingCategory.query()
      .findById(id)
      .whereNull('deletedAt')
      .withGraphFetched('[rankingCategoryType, featuredImage, rankingCriteria]');

    if (!category) return;

    return this.resolveEntityForCategory(category);
  }

  async findResidencesByCategory(
    rankingCategoryId: string,
    query: FetchResidencesByCategoryQuery
  ): Promise<any> {
    const { page, limit, sortBy, sortOrder, searchQuery, countryId } = query;
    const searchableColumns = ['residences.name', 'residences.description', 'residences.subtitle'];

    const baseQuery = Residence.query()
      .alias('residences')
      .join('residence_total_scores as rts', 'residences.id', 'rts.residence_id')
      .whereNull('residences.deleted_at')
      .where('residences.status', ResidenceStatusEnum.ACTIVE)
      .where('rts.ranking_category_id', rankingCategoryId)
      .modify((queryBuilder) => {
        if (countryId) queryBuilder.where('residences.country_id', countryId);
        applySearchFilter(queryBuilder, searchQuery, searchableColumns);
      });

    const { results, total } = await baseQuery
      .select('residences.*', 'rts.position')
      .withGraphFetched('[featuredImage, city, country, company, units, totalScores]')
      .orderBy('rts.position', 'asc')
      .modify((queryBuilder) => {
        if (sortBy && sortOrder) {
          const allowedSort = [
            'residences.name',
            'residences.yearBuilt',
            'residences.avgPricePerUnit',
          ];
          if (allowedSort.includes(sortBy)) queryBuilder.orderBy(sortBy, sortOrder);
        } else {
          queryBuilder.orderBy('residences.name', 'asc');
        }
      })
      .page(page - 1, limit);

    const totalPages = Math.ceil(total / limit);
    const residenceIds = results.map((r) => r.id);

    const scores = await this.knexService
      .connection('residence_total_scores')
      .select('residence_id', 'total_score', 'position')
      .whereIn('residence_id', residenceIds)
      .andWhere('ranking_category_id', rankingCategoryId);

    const scoreMap = new Map(
      scores.map((s) => [s.residenceId, { totalScore: s.totalScore, position: s.position }])
    );

    const validRankingCriteriaIds = await this.knexService
      .connection('ranking_category_criteria')
      .where('ranking_category_id', rankingCategoryId)
      .pluck('ranking_criteria_id');

    const criteriaScores = await this.knexService
      .connection('residence_ranking_criteria_scores as scores')
      .join('ranking_criteria as rc', 'rc.id', 'scores.ranking_criteria_id')
      .select([
        'scores.residence_id as residenceId',
        'scores.ranking_criteria_id as rankingCriteriaId',
        'scores.score',
        'rc.name as criteriaName',
        'rc.description as criteriaDescription',
        'rc.is_default as criteriaIsDefault',
      ])
      .whereIn('scores.residence_id', residenceIds);

    const scoreGrouped = new Map<string, any[]>();
    for (const row of criteriaScores) {
      const rcId = row.rankingCriteriaId;
      const residenceId = row.residenceId;
      if (!validRankingCriteriaIds.includes(rcId)) continue;
      if (!scoreGrouped.has(residenceId)) scoreGrouped.set(residenceId, []);
      const existing = scoreGrouped.get(residenceId)!;
      if (!existing.some((item) => item.rankingCriteriaId === rcId)) {
        existing.push({
          rankingCriteriaId: rcId,
          score: row.score,
          name: row.criteriaName,
          description: row.criteriaDescription,
          isDefault: row.criteriaIsDefault,
        });
      }
    }

    const data = results.map((res) => {
      const scoreEntry = scoreMap.get(res.id);

      return {
        ...res,
        totalScore: scoreEntry?.totalScore ?? 0,
        position: scoreEntry?.position ?? 0,
        rankingCriteriaScores: scoreGrouped.get(res.id) ?? [],
      };
    });

    return {
      data,
      pagination: { total, totalPages, page, limit },
    };
  }

  async findAll(
    query: FetchRankingCategoriesQuery
  ): Promise<{ data: any[]; pagination: PaginationResponse }> {
    const { page, limit, sortBy, sortOrder, searchQuery } = query;

    let rankingCategoryQuery = RankingCategory.query()
      .whereNull('deletedAt')
      .modify((queryBuilder) =>
        applyFilters(
          queryBuilder,
          { status: query.status, rankingCategoryTypeId: query.categoryTypeId },
          RankingCategory.tableName
        )
      )
      .withGraphFetched('[rankingCategoryType, featuredImage]');

    const columnsToSearch = [
      'ranking_categories.name',
      'ranking_categories.description',
      'ranking_categories.title',
    ];
    rankingCategoryQuery = applySearchFilter(
      rankingCategoryQuery.clone(),
      searchQuery,
      columnsToSearch
    );

    if (sortBy && sortOrder) {
      const columnsToSort = ['name', 'createdAt', 'updatedAt'];
      if (columnsToSort.includes(sortBy)) {
        rankingCategoryQuery = rankingCategoryQuery.orderBy(sortBy, sortOrder);
      }
    }

    const { paginatedQuery, totalCount, totalPages } = await applyPagination(
      rankingCategoryQuery,
      page,
      limit
    );

    // -------------------------
    // Dinamički fetch entiteta
    // -------------------------
    const tableEntityMap = new Map<string, string[]>();

    for (const category of paginatedQuery) {
      const table = category.rankingCategoryType?.key;
      const entityId = category.entityId;
      if (!table || !entityId) continue;

      if (!tableEntityMap.has(table)) {
        tableEntityMap.set(table, []);
      }

      tableEntityMap.get(table)!.push(entityId);
    }

    const resolvedEntities = new Map<string, Map<string, any>>();

    for (const [table, ids] of tableEntityMap.entries()) {
      // SPECIAL CASE: cities → include country
      if (table === 'cities') {
        const cities = await this.knexService.connection('cities').whereIn('id', ids).select('*');

        const countryIds = cities.map((c) => c.countryId).filter(Boolean);

        const countries = await this.knexService
          .connection('countries')
          .whereIn('id', countryIds)
          .select('*');

        const countryMap = new Map(countries.map((c) => [c.id, c]));

        const enrichedCities = cities.map((city) => ({
          ...city,
          country: countryMap.get(city.countryId) ?? null,
        }));

        resolvedEntities.set(table, new Map(enrichedCities.map((c) => [c.id, c])));
      } else {
        // regular fetch
        const entities = await this.knexService.connection(table).whereIn('id', ids).select('*');

        resolvedEntities.set(table, new Map(entities.map((e) => [e.id, e])));
      }
    }

    const enrichedData = paginatedQuery.map((category) => {
      const table = category.rankingCategoryType?.key;
      const entity =
        table && category.entityId
          ? (resolvedEntities.get(table)?.get(category.entityId) ?? null)
          : null;

      return {
        ...category,
        entity,
      };
    });

    return {
      data: enrichedData,
      pagination: {
        total: totalCount,
        totalPages,
        page,
        limit,
      },
    };
  }

  async findAllByUser(
    user: User,
    query: FetchRankingCategoriesQuery
  ): Promise<{ data: any[]; pagination: PaginationResponse }> {
    const { page, limit, sortBy, sortOrder, searchQuery } = query;

    if (!user.company) {
      throw new BadRequestException('User has no company');
    }

    const knex = RankingCategory.knex();
    // 1) Build a single QueryBuilder that only yields categories WITH at least one residence
    let queryBuilder = RankingCategory.query()
      .alias('rc')
      // inner‐join to force “has at least one residence”
      .join('residence_total_scores as rts', 'rts.ranking_category_id', 'rc.id')
      .join('residences as r', 'r.id', 'rts.residence_id')
      .joinRaw(
        `LEFT JOIN LATERAL (
          SELECT
            h.position,
            h.total_score
          FROM residence_total_score_history AS h
          WHERE h.residence_id        = r.id
            AND h.ranking_category_id = rc.id
          ORDER BY h.changed_at DESC
          OFFSET 1
          LIMIT 1
        ) AS prev ON TRUE`
      )
      .where('r.company_id', user.company!.id!)
      .select([
        'rc.id as id',
        'rc.name',
        'rc.slug',
        'rc.title',
        'rc.description',
        'rc.residenceLimitation',
        'rc.entity_type as rankingType',
        'rc.status',
        'r.id as residenceId',
        'r.name as residenceName',
        'r.slug as residenceSlug',
        'rts.position as position',
        'rts.total_score as totalScore',
        'prev.position      as previousPosition',
        'prev.total_score   as previousTotalScore',

        knex.raw(
          `EXISTS (
            SELECT 1
              FROM residence_position_requests req
              WHERE req.residence_id        = r.id
                AND req.ranking_category_id = rc.id
                AND req.status              IN (?, ?)
                AND req.requested_by        = ?
          ) AS "hasRequest"`,
          [
            ResidencePositionRequestStatusEnum.NEW,
            ResidencePositionRequestStatusEnum.PENDING,
            user.id,
          ]
        ),
      ]);

    // 2) apply your search helper
    queryBuilder = applySearchFilter(queryBuilder, searchQuery, [
      'rc.name',
      'rc.description',
      'rc.title',
    ]);

    // 3) sorting
    const sortable = {
      name: 'rc.name',
      createdAt: 'rc.created_at',
      updatedAt: 'rc.updated_at',
    };
    if (sortBy && sortOrder && sortable[sortBy]) {
      queryBuilder = queryBuilder.orderBy(sortable[sortBy], sortOrder);
    } else {
      queryBuilder = queryBuilder.orderBy('rc.name', 'asc');
    }

    // 4) pagination
    const { paginatedQuery, totalCount, totalPages } = await applyPagination(
      queryBuilder,
      page,
      limit
    );

    // 5) remap each row into your “one‐residence‐in‐the‐array” shape
    const data = paginatedQuery.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      title: row.title,
      description: row.description,
      residenceLimitation: row.residenceLimitation,
      rankingType: row.rankingType,
      status: row.status,
      hasRequest: row.hasRequest,
      previousPosition: row.previousPosition,
      previousTotalScore: Math.round(row.previousTotalScore ?? 0),
      residence: {
        id: row.residenceId,
        name: row.residenceName,
        slug: row.residenceSlug,
        position: row.position,
        totalScore: row.totalScore,
      },
    }));

    return {
      data,
      pagination: {
        total: totalCount,
        totalPages,
        page,
        limit,
      },
    };
  }

  async findByName(name: string): Promise<RankingCategory | undefined> {
    return RankingCategory.query().findOne({ name }).whereNull('deletedAt');
  }

  async findBySlug(slug: string): Promise<RankingCategory | undefined> {
    // return RankingCategory.query().findOne({ slug }).whereNull('deletedAt');
    const category = await RankingCategory.query()
      .findOne({ slug })
      .whereNull('deletedAt')
      .withGraphFetched('[rankingCategoryType, featuredImage, rankingCriteria]');

    if (!category) return;

    return this.resolveEntityForCategory(category);
  }

  async update(id: string, data: Partial<RankingCategory>): Promise<RankingCategory | undefined> {
    return RankingCategory.query()
      .patchAndFetchById(id, {
        name: data.name,
        slug: data.slug,
        title: data.title,
        description: data.description,
        residenceLimitation: data.residenceLimitation,
        rankingPrice: data.rankingPrice,
        status: data.status,
        rankingCategoryTypeId: data.rankingCategoryType?.id,
        featuredImageId: data.featuredImage?.id,
        entityId: data.entityId,
        updatedAt: new Date(),
      })
      .whereNull('deletedAt');
  }

  async assignWeights(
    id: string,
    data: { rankingCriteriaId: string; weight: number }[]
  ): Promise<void> {
    const trx = await this.knexService.connection.transaction();

    try {
      const totalWeight = data.reduce((sum, c) => sum + c.weight, 0);
      if (totalWeight !== 100) {
        throw new BadRequestException('Total weight must be exactly 100%');
      }

      await trx('ranking_category_criteria').where('ranking_category_id', id).delete();

      await trx('ranking_category_criteria').insert(
        data.map((c) => ({
          id: randomUUID(),
          ranking_category_id: id,
          ranking_criteria_id: c.rankingCriteriaId,
          weight: c.weight,
        }))
      );

      await trx.commit();
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  async softDelete(id: string): Promise<void> {
    await RankingCategory.query()
      .patch({ deletedAt: new Date() })
      .where('id', id)
      .whereNull('deletedAt');
  }

  private async resolveEntityForCategory(
    category: Partial<RankingCategory>
  ): Promise<RankingCategory | undefined> {
    const table = category.rankingCategoryType?.key;
    const entityId = category.entityId;

    if (!table || !entityId) {
      return category as RankingCategory;
    }

    if (table === 'cities') {
      const city = await this.knexService.connection('cities').where('id', entityId).first();

      if (!city) return category as RankingCategory;

      const country = await this.knexService
        .connection('countries')
        .where('id', city.countryId)
        .first();

      return {
        ...category,
        entity: {
          ...city,
          country: country ?? null,
        },
      } as RankingCategory;
    }

    const entity = await this.knexService.connection(table).where('id', entityId).first();

    return {
      ...category,
      entity: entity ?? null,
    } as RankingCategory;
  }
}

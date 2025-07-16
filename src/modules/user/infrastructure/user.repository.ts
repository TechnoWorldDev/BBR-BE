import { Injectable } from '@nestjs/common';
import { KnexService } from 'src/shared/infrastructure/database/knex.service';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import {
  buildBuyerJoin,
  buildCompanyJoin,
  buildLifestylesJoin,
  buildPermissionsJoin,
  buildRoleJoin,
  buildUnitTypesJoin,
} from 'src/shared/user-query';
import { buildUpdatePayload } from 'src/shared/utils/build-update-payload';
import { applyPagination } from 'src/shared/utils/pagination.util';
import { FetchUsersQuery } from '../application/command/fetch-users.query';
import { User } from '../domain/user.entity';
import { IUserRepository } from '../domain/user.repository.interface';
import { UpdateUserProfileRequest } from '../ui/request/update-user-profile.request';
import { UpdateUserRequest } from '../ui/request/update-user.request';
import { applyFilters } from 'src/shared/filters/query.dynamic-filters';
import { applySearchFilter } from 'src/shared/filters/query.search-filter';
import { v4 as uuidv4 } from 'uuid';
import { PlanEnum } from 'src/shared/types/plan.enum';

@Injectable()
export class UserRepositoryImpl implements IUserRepository {
  private readonly tableName = 'users';

  constructor(private readonly knexService: KnexService) {}

  @LogMethod()
  async create(userData: Partial<User>): Promise<User | undefined> {
    return this.knexService.connection.transaction(async (trx) => {
      const user = await User.query(trx).insert(userData).returning('*');

      if (user) {
        // ✅ If the user is a developer, create a company
        const isDeveloper = await trx('roles')
          .where({ name: 'developer', id: user.roleId })
          .select('id', 'name')
          .first();

        const isBuyer = await trx('roles')
          .where({ name: 'buyer', id: user.roleId })
          .select('id', 'name')
          .first();

        if (isDeveloper) {
          const plan = await trx('plans')
            .where({ code: PlanEnum.FREE })
            .select('id', 'name', 'code')
            .first();
          // ✅ Create a company for developers
          const companyId = uuidv4();
          await trx('companies').insert({
            id: companyId,
            name: userData.companyName || `${userData.fullName}'s Company`,
            address: null,
            phone_number: null,
            website: null,
            planId: plan?.id,
          });

          // ✅ Link developer user to the created company
          await trx('users').where({ id: user.id }).update({ company_id: companyId });
        }

        if (isBuyer) {
          // ✅ Create a company for developers
          await trx('user_buyers').insert({
            userId: user.id,
            imageId: null,
            phoneNumber: null,
            phoneNumberCountryCode: null,
            budgetRangeFrom: null,
            budgetRangeTo: null,
            currentLocation: null,
            preferredContactMethod: null,
            preferredResidenceLocation: null,
          });

          const updatedUser = await User.query(trx).findById(user.id);
          return updatedUser;
        }
      }

      return user;
    });
  }

  @LogMethod()
  // async findById(id: string): Promise<User | null> {
  //   const knex = this.knexService.connection;

  //   let query = this.knexService
  //     .connection(this.tableName)
  //     .where('users.id', id)
  //     .leftJoin(buildUnitTypesJoin(knex))
  //     .leftJoin(buildLifestylesJoin(knex))
  //     .leftJoin(buildRoleJoin(knex))
  //     .leftJoin(buildCompanyJoin(knex))
  //     .leftJoin(buildBuyerJoin(knex))
  //     .leftJoin(buildPermissionsJoin(knex));

  //   return query
  //     .select(
  //       'users.*',
  //       'role_json as role',
  //       'company',
  //       'buyer',
  //       'unitTypes',
  //       'lifestyles',
  //       'permissions'
  //     )
  //     .first();
  // }
  async findById(id: string): Promise<User | null> {
    const user = await User.query().findById(id).whereNull('users.deleted_at').withGraphFetched(`
      [
        role,
        company.[image, contactPersonAvatar, plan],
        buyer.[unitTypes, lifestyles]
      ]
    `);

    return user ?? null;
  }

  @LogMethod()
  async findByEmail(email: string): Promise<User | null> {
    return this.knexService
      .connection(this.tableName)
      .where({ email })
      .whereNull('deleted_at')
      .first();
  }

  @LogMethod()
  async findByCompanyId(companyId: string): Promise<User | null> {
    return this.knexService
      .connection(this.tableName)
      .where({ company_id: companyId })
      .whereNull('deleted_at')
      .first();
  }

  @LogMethod()
  async findAll(
    fetchQuery: FetchUsersQuery
  ): Promise<{ data: User[]; pagination: PaginationResponse }> {
    const { page, limit, sortBy, sortOrder, searchQuery, status, roleId } = fetchQuery;
    const knex = this.knexService.connection;

    const allowedColumns = ['fullName', 'email', 'createdAt', 'updatedAt'];

    // base query with joins
    const baseQuery = User.query()
      .whereNull('users.deleted_at')
      .modify((qb) => {
        applyFilters(
          qb,
          {
            status,
            roleId,
          },
          User.tableName
        );
      })
      .leftJoin(buildUnitTypesJoin(knex))
      .leftJoin(buildLifestylesJoin(knex))
      .leftJoin(buildRoleJoin(knex))
      .leftJoin(buildCompanyJoin(knex))
      .leftJoin(buildBuyerJoin(knex))
      .select('users.*', 'role', 'company', 'buyer', 'unitTypes');

    // apply search
    const columnsToSearch = ['users.full_name', 'users.email'];
    const searchableQuery = applySearchFilter(baseQuery.clone(), searchQuery, columnsToSearch);

    // apply sort
    if (sortBy && sortOrder && allowedColumns.includes(sortBy)) {
      searchableQuery.orderBy(sortBy, sortOrder);
    }

    // pagination
    const { paginatedQuery, totalCount, totalPages } = await applyPagination(
      searchableQuery,
      page,
      limit
    );

    return {
      data: paginatedQuery,
      pagination: {
        total: totalCount,
        totalPages,
        page,
        limit,
      },
    };
  }

  @LogMethod()
  async update(userId: string, updateData: UpdateUserRequest): Promise<User> {
    const updatedUser = await User.query().patchAndFetchById(userId, updateData);

    return updatedUser;
  }

  @LogMethod()
  async delete(id: string): Promise<void> {
    // Soft delete
    await this.knexService
      .connection(this.tableName)
      .where('users.id', id)
      .update({ deleted_at: this.knexService.connection.fn.now() });
  }

  @LogMethod()
  async updateProfile(userId: string, updateData: UpdateUserProfileRequest): Promise<any> {
    await this.knexService.connection.transaction(async (trx) => {
      await trx('users').where({ id: userId }).update({
        fullName: updateData.fullName,
        notifyBlogs: updateData.notifyBlogs,
        notifyMarketTrends: updateData.notifyMarketTrends,
        receiveLuxuryInsights: updateData.receiveLuxuryInsights,
        notifyLatestNews: updateData.notifyLatestNews,
        pushNotifications: updateData.pushNotifications,
        emailNotifications: updateData.emailNotifications,
        updatedAt: new Date(),
      });

      const isBuyer = await trx('user_buyers').where({ userId: userId }).first();
      if (isBuyer) {
        const buyerUpdatePayload = buildUpdatePayload({
          imageId: updateData.imageId,
          phoneNumber: updateData.phoneNumber,
          phoneNumberCountryCode: updateData.phoneNumber,
          budgetRangeFrom: updateData.budgetRangeFrom,
          budgetRangeTo: updateData.budgetRangeTo,
          currentLocation: updateData.currentLocation,
          preferredContactMethod: updateData.preferredContactMethod,
          preferredResidenceLocation: updateData.preferredResidenceLocation,
        });

        if (Object.keys(buyerUpdatePayload).length) {
          await trx('user_buyers').where({ userId: userId }).update(buyerUpdatePayload);
        }

        if (updateData.unitTypes) {
          await trx('user_buyer_unit_types').where({ userId: userId }).delete();

          if (updateData.unitTypes.length) {
            await trx('user_buyer_unit_types').insert(
              updateData.unitTypes.map((id) => ({
                userId: userId,
                unitTypeId: id,
              }))
            );
          }
        }

        if (updateData.lifestyles) {
          await trx('user_buyer_lifestyles').where({ userId: userId }).delete();

          if (updateData.lifestyles.length) {
            await trx('user_buyer_lifestyles').insert(
              updateData.lifestyles.map((id) => ({
                userId: userId,
                lifestyleId: id,
              }))
            );
          }
        }
      }
    });

    return await this.findById(userId);
  }
}

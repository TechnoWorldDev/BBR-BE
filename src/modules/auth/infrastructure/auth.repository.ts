import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/user/domain/user.entity';
import { KnexService } from 'src/shared/infrastructure/database/knex.service';
import {
  buildBuyerJoin,
  buildCompanyJoin,
  buildLifestylesJoin,
  buildPermissionsJoin,
  buildRoleJoin,
  buildUnitTypesJoin,
} from 'src/shared/user-query';
import { v4 as uuidv4 } from 'uuid';
import { IAuthRepository } from '../domain/auth.repository.interface';
import { PlanEnum } from 'src/shared/types/plan.enum';
@Injectable()
export class AuthRepository implements IAuthRepository {
  private tableName = 'users';

  constructor(private readonly knexService: KnexService) {}

  async findByEmail(email: string) {
    const knex = this.knexService.connection;
    let query = this.knexService
      .connection(this.tableName)
      .where('email', email)
      .whereNull('users.deleted_at')
      .leftJoin(buildUnitTypesJoin(knex))
      .leftJoin(buildLifestylesJoin(knex))
      .leftJoin(buildRoleJoin(knex))
      .leftJoin(buildCompanyJoin(knex))
      .leftJoin(buildBuyerJoin(knex))
      .select('users.*', 'role', 'company', 'buyer', 'unitTypes', 'lifestyles');

    return query.first();
  }

  findRoleByName(name: string) {
    return this.knexService.connection('roles').where({ name: name.toLowerCase() }).first();
  }

  async create(userData: Partial<User>): Promise<User | undefined> {
    return this.knexService.connection.transaction(async (trx) => {
      const user = await User.query(trx)
        .insert({
          fullName: userData.fullName,
          email: userData.email,
          password: userData.password,
          roleId: userData.roleId,
          signupMethod: userData.signupMethod,
          status: userData.status,
          emailVerified: userData.emailVerified,
        })
        .returning('*');

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
            planId: plan.id,
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

  async saveResetToken(userId: string, resetToken: string) {
    const [user] = await this.knexService
      .connection(this.tableName)
      .where({ id: userId })
      .update({ reset_token: resetToken })
      .returning('*');

    return user;
  }
}

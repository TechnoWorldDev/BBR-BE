import { Injectable } from '@nestjs/common';
import { IRoleRepository } from '../domain/role.repository.interface';
import { KnexService } from 'src/shared/infrastructure/database/knex.service';
import { Role } from '../domain/role.entity';
import { applyPagination } from 'src/shared/utils/pagination.util';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';

@Injectable()
export class RoleRepositoryImpl implements IRoleRepository {
  constructor(private readonly knexService: KnexService) {}

  async createRole(name: string): Promise<Role> {
    const [role] = await this.knexService.connection('roles').insert({ name }).returning('*');

    return role;
  }

  async assignPermission(roleId: string, permissionId: string): Promise<void> {
    await this.knexService
      .connection('role_permissions')
      .insert({ role_id: roleId, permission_id: permissionId });
  }

  async getPermissions(roleId: string): Promise<string[]> {
    const permissions = await this.knexService
      .connection('role_permissions as rp')
      .select('p.name')
      .leftJoin('permissions as p', 'rp.permission_id', 'p.id')
      .where('rp.role_id', roleId);

    return permissions.map((p) => p.name);
  }

  async findAll(
    page: number,
    limit: number
  ): Promise<{ data: Role[]; pagination: PaginationResponse }> {
    const query = this.knexService.connection('roles').select('*');
    const { paginatedQuery, totalCount, totalPages } = await applyPagination(query, page, limit);

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

  async findByName(name: string): Promise<Role | null> {
    const role = await this.knexService.connection('roles').where('name', name).first();
    return role;
  }

  async findById(id: string): Promise<Role | null> {
    const role = await this.knexService.connection('roles').where('id', id).first();
    return role;
  }
}

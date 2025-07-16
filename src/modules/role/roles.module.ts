import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';
import { PubSubService } from '../../shared/messaging/pubsub.service';
import { IRoleRepository } from './domain/role.repository.interface';
import { RoleRepositoryImpl } from './infrastructure/role.repository';
import { RoleController } from './ui/role.controller';
import { AssignPermissionCommandHandler } from './application/handlers/assign-permission.command.handler';
import { FetchPermissionsCommandQuery } from './application/query/fetch-permissions.command.query';
import { CreateRoleCommandHandler } from './application/handlers/create-role.command.handler';
import { FetchRolesCommandQuery } from './application/query/fetch-roles.command.query';
@Module({
  imports: [DatabaseModule],
  controllers: [RoleController],
  providers: [
    {
      provide: IRoleRepository,
      useClass: RoleRepositoryImpl,
    },
    PubSubService,
    AssignPermissionCommandHandler,
    FetchPermissionsCommandQuery,
    CreateRoleCommandHandler,
    FetchRolesCommandQuery,
  ],
  exports: [],
})
export class RoleModule {}

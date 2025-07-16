import { IRoleRepository } from 'src/modules/role/domain/role.repository.interface';
import { RedisService } from 'src/shared/cache/redis.service';
import { PubSubService } from 'src/shared/messaging/pubsub.service';
import { Injectable } from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { AssignPermissionCommand } from '../commands/assign-permission.command';

@Injectable()
export class AssignPermissionCommandHandler {
  constructor(
    private readonly roleRepository: IRoleRepository,
    private readonly redisService: RedisService,
    private readonly pubSubService: PubSubService
  ) {}

  @LogMethod()
  async handler(command: AssignPermissionCommand): Promise<void> {
    await this.roleRepository.assignPermission(command.roleId, command.permissionId);

    await this.redisService.delCache(`role-permissions:${command.roleId}`);
    await this.pubSubService.invalidateCache(`role-permissions:${command.roleId}`);
  }
}

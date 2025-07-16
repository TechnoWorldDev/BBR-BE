import { RedisService } from 'src/shared/cache/redis.service';
import { PubSubService } from 'src/shared/messaging/pubsub.service';
import { IRoleRepository } from 'src/modules/role/domain/role.repository.interface';
import { Role } from 'src/modules/role/domain/role.entity';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { ConflictException, Injectable } from '@nestjs/common';
import { CreateRoleCommand } from '../commands/create-role.command';

@Injectable()
export class CreateRoleCommandHandler {
  constructor(
    private readonly roleRepository: IRoleRepository,
    private readonly redisService: RedisService,
    private readonly pubSubService: PubSubService
  ) {}

  @LogMethod()
  async handler(command: CreateRoleCommand): Promise<Role> {
    const existRole = await this.roleRepository.findByName(command.name);
    if (existRole) throw new ConflictException('Role already exists');

    const role = await this.roleRepository.createRole(command.name);

    // Invalidate cache across all servers
    await this.redisService.delCache('roles-list');
    await this.pubSubService.invalidateCache('roles-list');

    return role;
  }
}

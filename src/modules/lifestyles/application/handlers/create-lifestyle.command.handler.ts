import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { IMediaService } from 'src/shared/media/media.service.interface';
import { Lifestyle } from '../../domain/lifestyle.entity';
import { ILifestyleRepository } from '../../domain/lifestyle.repository.interface';
import { CreateLifestyleCommand } from '../command/create-lifestyle.command';

@Injectable()
export class CreateLifestyleCommandHandler {
  constructor(
    private readonly lifestyleRepository: ILifestyleRepository,
    private readonly mediaService: IMediaService
  ) {}

  @LogMethod()
  async handle(command: CreateLifestyleCommand): Promise<Lifestyle> {
    const existingLifestyle = await this.lifestyleRepository.findByName(command.name);
    if (existingLifestyle) {
      throw new ConflictException('Lifestyle already exists');
    }

    const created = await this.lifestyleRepository.create(command);

    if (!created) {
      throw new InternalServerErrorException('Lifestyle can not be created');
    }

    return created;
  }
}

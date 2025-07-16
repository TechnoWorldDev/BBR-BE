import {
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
  Injectable,
} from '@nestjs/common';
import { CreateContinentCommand } from '../command/create-continent.command';
import { Continent } from '../../domain/continent.entity';
import { IContinentRepository } from '../../domain/continent.repository.interface';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';

@Injectable()
export class CreateContinentCommandHandler {
  constructor(private readonly continentRepository: IContinentRepository) {}

  @LogMethod()
  async handle(command: CreateContinentCommand): Promise<Continent> {
    const existingContinent = await this.continentRepository.findByCode(command.code);
    if (existingContinent) {
      throw new ConflictException('Continent with this code already exists');
    }

    return this.continentRepository.create({ name: command.name, code: command.code });
  }
}

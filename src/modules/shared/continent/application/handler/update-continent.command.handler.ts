import {
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
  Injectable,
} from '@nestjs/common';
import { UpdateContinentCommand } from '../command/update-continent.command';
import { Continent } from '../../domain/continent.entity';
import { IContinentRepository } from '../../domain/continent.repository.interface';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';

@Injectable()
export class UpdateContinentCommandHandler {
  constructor(private readonly continentRepository: IContinentRepository) {}

  @LogMethod()
  async handle(command: UpdateContinentCommand): Promise<Continent> {
    const existingContinent = await this.continentRepository.findById(command.id);
    if (!existingContinent) {
      throw new NotFoundException('Continent not found');
    }

    const existingContinentByCode = await this.continentRepository.findByCode(command.code);
    if (existingContinentByCode && existingContinentByCode.id !== command.id) {
      throw new ConflictException('Continent with this code already exists');
    }

    const updatedContinent = await this.continentRepository.update(command.id, {
      name: command.name,
      code: command.code,
    });
    if (!updatedContinent) {
      throw new InternalServerErrorException('Continent not updated');
    }

    return updatedContinent;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { IContinentRepository } from '../../domain/continent.repository.interface';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';

@Injectable()
export class DeleteContinentCommandHandler {
  constructor(private readonly continentRepository: IContinentRepository) {}

  @LogMethod()
  async handle(id: string): Promise<void> {
    const existingContinent = await this.continentRepository.findById(id);
    if (!existingContinent) {
      throw new NotFoundException('Continent not found');
    }

    await this.continentRepository.delete(id);
  }
}

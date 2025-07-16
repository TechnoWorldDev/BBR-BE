import { Injectable, NotFoundException } from '@nestjs/common';
import { ContinentResponse } from '../../ui/response/continent.response';
import { IContinentRepository } from '../../domain/continent.repository.interface';
import { Continent } from '../../domain/continent.entity';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';

@Injectable()
export class FindContinentByIdCommandQuery {
  constructor(private readonly continentRepository: IContinentRepository) {}

  @LogMethod()
  async handle(id: string): Promise<Continent> {
    const continent = await this.continentRepository.findById(id);
    if (!continent) {
      throw new NotFoundException('Continent not found');
    }

    return continent;
  }
}

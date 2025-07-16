import { Injectable, NotFoundException } from '@nestjs/common';
import { ICityRepository } from '../../domain/city.repository.interface';
import { LogMethod } from '../../../../../shared/infrastructure/logger/log.decorator';

@Injectable()
export class DeleteCityCommandHandler {
  constructor(private readonly cityRepository: ICityRepository) {}

  @LogMethod()
  async handle(id: string): Promise<void> {
    const city = await this.cityRepository.findById(id);
    if (!city) throw new NotFoundException('City not found');

    await this.cityRepository.delete(id);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { Lifestyle } from '../../domain/lifestyle.entity';
import { ILifestyleRepository } from '../../domain/lifestyle.repository.interface';

@Injectable()
export class FindByIdLifestyleQueryHandler {
  constructor(private readonly lifestyleRepository: ILifestyleRepository) {}

  async handle(id: string): Promise<Lifestyle> {
    const lifestyle = await this.lifestyleRepository.findById(id);

    if (!lifestyle) {
      throw new NotFoundException('Lifestyle not found');
    }

    return lifestyle;
  }
}

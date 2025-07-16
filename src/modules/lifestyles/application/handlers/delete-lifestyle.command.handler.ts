import { Injectable, NotFoundException } from '@nestjs/common';
import { ILifestyleRepository } from '../../domain/lifestyle.repository.interface';
import { DeleteLifestyleCommand } from '../command/delete-lifestyle.command';

@Injectable()
export class DeleteLifestyleCommandHandler {
  constructor(private readonly lifestyleRepository: ILifestyleRepository) {}

  async handle(command: DeleteLifestyleCommand): Promise<void> {
    const existingLifestyle = await this.lifestyleRepository.findById(command.id);

    if (!existingLifestyle) {
      throw new NotFoundException('Lifestyle not found');
    }

    await this.lifestyleRepository.delete(command.id);
  }
}

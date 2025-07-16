import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateAmenityCommand } from '../commands/create-amenity.command';
import { Amenity } from '../../domain/amenity.entity';
import { LogMethod } from '../../../../../shared/infrastructure/logger/log.decorator';
import { IMediaRepository } from '../../../../media/domain/media.repository.interface';
import { IAmenityRepository } from '../../domain/amenity.repository.interface';

@Injectable()
export class CreateAmenityCommandHandler {
  constructor(
    private readonly amenityRepository: IAmenityRepository,
    private readonly mediaRepository: IMediaRepository
  ) {}

  @LogMethod()
  async handle(command: CreateAmenityCommand): Promise<Amenity> {
    const existingAmenity = await this.amenityRepository.findByName(command.name);
    if (existingAmenity) {
      throw new ConflictException('Amenity with this name already exists');
    }

    const icon = await this.mediaRepository.findById(command.iconId);
    if (!icon) {
      throw new NotFoundException('Icon (media) not found');
    }

    const featuredImage = await this.mediaRepository.findById(command.featuredImageId);
    if (!featuredImage) {
      throw new NotFoundException('Featured image (media) not found');
    }

    const result = await this.amenityRepository.create({
      name: command.name,
      description: command.description,
      icon: icon,
      featuredImage: featuredImage,
    });

    if (!result) {
      throw new InternalServerErrorException('Amenity not saved');
    }

    return result;
  }
}

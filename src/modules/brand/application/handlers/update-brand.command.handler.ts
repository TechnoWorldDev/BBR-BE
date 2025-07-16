import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IMediaRepository } from 'src/modules/media/domain/media.repository.interface';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { BrandStatus } from '../../domain/brand-status.enum';
import { Brand } from '../../domain/brand.entity';
import { IBrandRepository } from '../../domain/brand.repository.interface';
import { UpdateBrandCommand } from '../command/update-brand.command';

@Injectable()
export class UpdateBrandCommandHandler {
  constructor(
    private readonly brandRepository: IBrandRepository,
    private readonly mediaRepository: IMediaRepository
  ) {}

  @LogMethod()
  async handle(command: UpdateBrandCommand): Promise<Brand> {
    const existingBrand = await this.brandRepository.findById(command.id);
    if (!existingBrand) {
      throw new NotFoundException('Brand not found');
    }

    const existingBrandByName = await this.brandRepository.findByName(command.name ?? '');
    if (existingBrandByName && existingBrandByName.id !== command.id) {
      throw new ConflictException('Brand with this name already exists');
    }

    const logo = await this.mediaRepository.findById(command.logoId);
    if (!logo) {
      throw new NotFoundException('Logo not found');
    }

    let slug = existingBrand.slug;
    if (command.slug && command.slug !== existingBrand.slug) {
      const rawSlug = command.slug?.trim();
      slug = Brand.slugify(rawSlug);

      const existing = await this.brandRepository.findBySlug(slug);
      if (existing && existing.id !== command.id) {
        throw new ConflictException(`Brand with slug ${slug} already exists`);
      }
    }

    const updateData = {
      name: command.name,
      slug: slug,
      description: command.description,
      brandTypeId: command.brandTypeId,
      logoId: logo.id,
      status: command.status as BrandStatus,
    };

    const updatedBrand = await this.brandRepository.update(existingBrand.id, updateData);
    if (!updatedBrand) {
      throw new InternalServerErrorException('Brand not updated');
    }

    return updatedBrand;
  }
}

import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { IRankingCategoryRepository } from '../../domain/ranking-category.repository.interface';
import { IMediaRepository } from 'src/modules/media/domain/media.repository.interface';
import { RankingCategory } from '../../domain/ranking-category.entity';
import { UpdateRankingCategoryCommand } from '../command/update-ranking-category.command';
import { IRankingCategoryTypeRepository } from '../../../categorytype/domain/ranking-category-type.repository.interface';

@Injectable()
export class UpdateRankingCategoryCommandHandler {
  constructor(
    private readonly rankingCategoryRepository: IRankingCategoryRepository,
    private readonly rankingCategoryTypeRepository: IRankingCategoryTypeRepository,
    private readonly mediaRepository: IMediaRepository
  ) {}

  @LogMethod()
  async handle(command: UpdateRankingCategoryCommand): Promise<RankingCategory> {
    const existingCategory = await this.rankingCategoryRepository.findById(command.id);
    if (!existingCategory) {
      throw new NotFoundException('Ranking Category not found');
    }

    const existingCategoryByName = await this.rankingCategoryRepository.findByName(
      command.name ?? ''
    );
    if (existingCategoryByName && existingCategoryByName.id !== command.id) {
      throw new ConflictException('Ranking Category with this name already exists');
    }

    const categoryType = await this.rankingCategoryTypeRepository.findById(
      command.rankingCategoryTypeId
    );
    if (!categoryType) {
      throw new NotFoundException('Ranking Category Type not found');
    }

    const featuredImage = await this.mediaRepository.findById(command.featuredImageId);
    if (!featuredImage) {
      throw new NotFoundException('Featured image not found');
    }

    let slug = existingCategory.slug;
    if (command.slug && command.slug !== existingCategory.slug) {
      const rawSlug = command.slug?.trim() ?? command.name!;
      slug = RankingCategory.slugify(rawSlug);

      const existing = await this.rankingCategoryRepository.findBySlug(slug);
      if (existing && existing.id !== command.id) {
        throw new ConflictException(`Ranking category with slug ${slug} already exists`);
      }
    }

    const updateData: Partial<RankingCategory> = {
      name: command.name,
      slug: slug,
      title: command.title,
      description: command.description,
      rankingCategoryType: categoryType,
      residenceLimitation: command.residenceLimitation,
      rankingPrice: command.rankingPrice,
      status: command.status,
      featuredImage: featuredImage,
      entityId: command.entityId,
    };

    const updatedCategory = await this.rankingCategoryRepository.update(
      existingCategory.id,
      updateData
    );
    if (!updatedCategory) {
      throw new InternalServerErrorException('Ranking Category not updated');
    }

    return updatedCategory;
  }
}

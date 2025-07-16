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
import { CreateRankingCategoryCommand } from '../command/create-ranking-category.command';
import { IRankingCategoryTypeRepository } from '../../../categorytype/domain/ranking-category-type.repository.interface';
import { IMediaService } from '../../../../../../shared/media/media.service.interface';

@Injectable()
export class CreateRankingCategoryCommandHandler {
  constructor(
    private readonly rankingCategoryRepository: IRankingCategoryRepository,
    private readonly rankingCategoryTypeRepository: IRankingCategoryTypeRepository,
    private readonly mediaRepository: IMediaRepository,
    private readonly mediaService: IMediaService
  ) {}

  @LogMethod()
  async handle(command: CreateRankingCategoryCommand): Promise<RankingCategory> {
    const existingCategory = await this.rankingCategoryRepository.findByName(command.name);

    if (existingCategory) {
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

    const rawSlug = command.slug?.trim() ?? command.name!;
    let slug = RankingCategory.slugify(rawSlug);

    const existingSlug = await this.rankingCategoryRepository.findBySlug(slug);
    if (existingSlug) {
      // throw new ConflictException(`Ranking category with slug ${slug} already exists`);
      slug += `-${Math.random().toString(36).substring(2, 7)}`;
    }

    const categoryData: Partial<RankingCategory> = {
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

    const createdCategory = await this.rankingCategoryRepository.create(categoryData);

    if (!createdCategory) {
      throw new InternalServerErrorException('Ranking Category could not be saved');
    }

    await this.mediaService.addTemporalUrl(createdCategory.featuredImage);

    return createdCategory;
  }
}

import { MediaResponse } from 'src/modules/media/ui/response/media.response';
import { RankingCategoryTypeResponse } from '../../../categorytype/ui/response/ranking-category-type.response';
import { AssignWeightsToRankingCategoryCommand } from '../../application/command/assign-weights-to-ranking-category.command';
import { CreateRankingCategoryCommand } from '../../application/command/create-ranking-category.command';
import { UpdateRankingCategoryStatusCommand } from '../../application/command/update-ranking-category-status.command';
import { UpdateRankingCategoryCommand } from '../../application/command/update-ranking-category.command';
import { RankingCategory } from '../../domain/ranking-category.entity';
import { CriteriaWeightRequest } from '../request/assign-weights.request';
import { CreateRankingCategoryRequest } from '../request/create-ranking-category.request';
import { UpdateRankingCategoryStatusRequest } from '../request/update-ranking-category-status.request';
import { UpdateRankingCategoryRequest } from '../request/update-ranking-category.request';
import { RankingCategoryResponse } from '../response/ranking-category.response';
import { RankingCriteriaResponse } from '../../../criteria/ui/response/ranking-criteria.response';
import { RankingCriteriaMapper } from '../../../criteria/ui/mappers/ranking-criteria.mapper';
import { RankingCategoryPublicResponse } from '../response/ranking-category.public.response';

export class RankingCategoryMapper {
  static toCreateCommand(request: CreateRankingCategoryRequest): CreateRankingCategoryCommand {
    return new CreateRankingCategoryCommand(
      request.name,
      request.slug,
      request.title,
      request.description,
      request.rankingCategoryTypeId,
      request.residenceLimitation,
      request.rankingPrice,
      request.featuredImageId,
      request.status,
      request.entityId
    );
  }

  static toUpdateCommand(
    id: string,
    request: UpdateRankingCategoryRequest
  ): UpdateRankingCategoryCommand {
    return new UpdateRankingCategoryCommand(
      id,
      request.name,
      request.slug,
      request.title,
      request.description,
      request.rankingCategoryTypeId,
      request.residenceLimitation,
      request.rankingPrice,
      request.featuredImageId,
      request.status,
      request.entityId
    );
  }

  static toUpdateStatusCommand(
    id: string,
    request: UpdateRankingCategoryStatusRequest
  ): UpdateRankingCategoryStatusCommand {
    return new UpdateRankingCategoryStatusCommand(id, request.status);
  }

  static toAssignWeightsCommand(
    id: string,
    criteriaWeights: CriteriaWeightRequest[]
  ): AssignWeightsToRankingCategoryCommand {
    return new AssignWeightsToRankingCategoryCommand(id, criteriaWeights);
  }
  static toResponse(rankingCategory: RankingCategory): RankingCategoryResponse {
    return new RankingCategoryResponse(
      rankingCategory.id,
      rankingCategory.name,
      rankingCategory.slug,
      rankingCategory.title,
      rankingCategory.description,
      rankingCategory.rankingCategoryType
        ? new RankingCategoryTypeResponse(
            rankingCategory.rankingCategoryType.id,
            rankingCategory.rankingCategoryType.name,
            rankingCategory.rankingCategoryType.key
          )
        : null,
      rankingCategory.rankingCriteria
        ? rankingCategory.rankingCriteria.map((criteria) =>
            RankingCriteriaMapper.toResponse(criteria)
          )
        : [],
      rankingCategory.residenceLimitation,
      rankingCategory.rankingPrice,
      rankingCategory.featuredImage
        ? new MediaResponse(
            rankingCategory.featuredImage.id,
            rankingCategory.featuredImage.originalFileName,
            rankingCategory.featuredImage.mimeType,
            rankingCategory.featuredImage.uploadStatus,
            rankingCategory.featuredImage.size,
            rankingCategory.featuredImage.securedUrl
          )
        : null,
      rankingCategory.status,
      rankingCategory.entityId ?? null,
      rankingCategory.entity ?? null,
      rankingCategory.hasRequest,
      rankingCategory.previousPosition ?? null,
      rankingCategory.previousTotalScore ?? null
    );
  }

  static toPublicResponse(rankingCategory: RankingCategory): RankingCategoryPublicResponse {
    return new RankingCategoryPublicResponse(
      rankingCategory.id,
      rankingCategory.name,
      rankingCategory.slug,
      rankingCategory.title,
      rankingCategory.description,
      rankingCategory.rankingCategoryType
        ? new RankingCategoryTypeResponse(
            rankingCategory.rankingCategoryType.id,
            rankingCategory.rankingCategoryType.name,
            rankingCategory.rankingCategoryType.key
          )
        : null,
      rankingCategory.featuredImage
        ? new MediaResponse(
            rankingCategory.featuredImage.id,
            rankingCategory.featuredImage.originalFileName,
            rankingCategory.featuredImage.mimeType,
            rankingCategory.featuredImage.uploadStatus,
            rankingCategory.featuredImage.size,
            rankingCategory.featuredImage.securedUrl
          )
        : null,
      rankingCategory.residenceLimitation,
      rankingCategory.entityId ?? null,
      rankingCategory.entity ?? null
    );
  }
}

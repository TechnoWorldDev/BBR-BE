import { MediaResponse } from 'src/modules/media/ui/response/media.response';
import { RankingCategory } from '../../domain/ranking-category.entity';
import { RankingCategoryResponse } from '../response/ranking-category.response';

export class RankingCategoryMapper {
  static toResponse(rankingCategory: RankingCategory): RankingCategoryResponse {
    return new RankingCategoryResponse(
      rankingCategory.id,
      rankingCategory.name,
      rankingCategory.slug,
      rankingCategory.title,
      rankingCategory.description,
      rankingCategory.featuredImage
        ? new MediaResponse(
            rankingCategory.featuredImage.id,
            rankingCategory.featuredImage.originalFileName,
            rankingCategory.featuredImage.mimeType,
            rankingCategory.featuredImage.uploadStatus,
            rankingCategory.featuredImage.size,
            rankingCategory.featuredImage.securedUrl
          )
        : null
    );
  }
}

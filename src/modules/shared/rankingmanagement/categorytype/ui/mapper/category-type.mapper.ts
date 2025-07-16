import { UpdateRankingCategoryTypeRequest } from '../request/update-ranking-category-type.request';
import { CreateRankingCategoryTypeCommand } from '../../application/command/create-ranking-category-type.command';
import { UpdateRankingCategoryTypeCommand } from '../../application/command/update-ranking-category-type.command';
import { RankingCategoryTypeResponse } from '../response/ranking-category-type.response';
import { RankingCategoryType } from '../../domain/ranking-category-type.entity';
import { CreateRankingCategoryTypeRequest } from '../request/create-ranking-category-type.request';

export class RankingCategoryTypeMapper {
  static toCreateCommand(
    request: CreateRankingCategoryTypeRequest
  ): CreateRankingCategoryTypeCommand {
    return new CreateRankingCategoryTypeCommand(request.name, request.key!);
  }

  static toUpdateCommand(
    id: string,
    request: UpdateRankingCategoryTypeRequest
  ): UpdateRankingCategoryTypeCommand {
    return new UpdateRankingCategoryTypeCommand(id, request.name, request.key!);
  }

  static toResponse(categoryType: RankingCategoryType): RankingCategoryTypeResponse {
    return new RankingCategoryTypeResponse(categoryType.id, categoryType.name, categoryType.key);
  }
}

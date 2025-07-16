import { CreatePositionRequestCommand } from '../../application/command/create-position-request.command';
import { CreatePositionRequestRequest } from '../request/create-position-request.request';
import { ResidencePositionRequestResponse } from '../response/residence-position-requests.response';
import { RankingCategoryMapper } from './ranking-category.mapper';
import { ResidenceMapper } from './residence.mapper';
import { UserMapper } from './user.mapper';

export class PositionRequestMapper {
  static toResponse(positionRequest) {
    return new ResidencePositionRequestResponse(
      positionRequest.id,
      positionRequest.residence ? ResidenceMapper.toResponse(positionRequest.residence) : null,
      positionRequest.rankingCategory
        ? RankingCategoryMapper.toResponse(positionRequest.rankingCategory)
        : null,
      positionRequest.requestedPosition,
      positionRequest.requestedByUser
        ? UserMapper.toResponse(positionRequest.requestedByUser)
        : null,
      positionRequest.requestedAt,
      positionRequest.status,
      positionRequest.reviewedByUser
        ? UserMapper.toResponse(positionRequest.requestedByUser)
        : null,
      positionRequest.reviewedAt,
      positionRequest.reviewNotes,
      positionRequest.createdAt,
      positionRequest.updatedAt
    );
  }

  static toCreateCommand(
    positionRequest: CreatePositionRequestRequest
  ): CreatePositionRequestCommand {
    return {
      residenceId: positionRequest.residenceId,
      rankingCategoryId: positionRequest.rankingCategoryId,
      requestedBy: positionRequest.requestedBy,
    };
  }
}

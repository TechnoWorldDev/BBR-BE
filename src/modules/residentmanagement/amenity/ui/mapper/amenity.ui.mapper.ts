import { CreateAmenityRequest } from '../request/create-amenity.request';
import { UpdateAmenityRequest } from '../request/update-amenity.request';
import { CreateAmenityCommand } from '../../application/commands/create-amenity.command';
import { UpdateAmenityCommand } from '../../application/commands/update-amenity.command';
import { Amenity } from '../../domain/amenity.entity';
import { AmenityResponse } from '../response/amenity.response';
import { MediaResponse } from '../../../../media/ui/response/media.response';

export class AmenityMapper {
  static toCreateCommand(request: CreateAmenityRequest): CreateAmenityCommand {
    return new CreateAmenityCommand(
      request.name,
      request.description,
      request.iconId,
      request.featuredImageId
    );
  }

  static toUpdateCommand(id: string, request: UpdateAmenityRequest): UpdateAmenityCommand {
    return new UpdateAmenityCommand(
      id,
      request.name,
      request.description,
      request.iconId,
      request.featuredImageId
    );
  }

  static toResponse(amenity: Amenity): AmenityResponse {
    return new AmenityResponse(
      amenity.id,
      amenity.name,
      amenity.description,
      amenity.icon
        ? new MediaResponse(
            amenity.icon.id,
            amenity.icon.originalFileName,
            amenity.icon.mimeType,
            amenity.icon.uploadStatus,
            amenity.icon.size,
            amenity.icon.securedUrl
          )
        : null,
      amenity.featuredImage
        ? new MediaResponse(
            amenity.featuredImage.id,
            amenity.featuredImage.originalFileName,
            amenity.featuredImage.mimeType,
            amenity.featuredImage.uploadStatus,
            amenity.featuredImage.size,
            amenity.featuredImage.securedUrl
          )
        : null,
      amenity.createdAt,
      amenity.updatedAt,
      amenity.deletedAt
    );
  }
}

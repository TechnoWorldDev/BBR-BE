import { MediaResponse } from 'src/modules/media/ui/response/media.response';
import { Residence } from '../../domain/residence.entity';
import { ResidencePublicResponse } from '../response/residence.public.response';

export class ResidenceMapper {
  static toPublicResponse(residence: Residence): ResidencePublicResponse {
    return new ResidencePublicResponse(
      residence.id,
      residence.name,
      residence.slug,
      residence.status,
      residence.developmentStatus,
      residence.subtitle,
      residence.description,
      residence.budgetStartRange,
      residence.budgetEndRange,
      residence.address,
      residence.latitude,
      residence.longitude,
      residence.createdAt,
      residence.updatedAt,
      residence.rentalPotential,
      residence.websiteUrl,
      residence.yearBuilt,
      residence.floorSqft,
      residence.staffRatio,
      residence.avgPricePerUnit,
      residence.avgPricePerSqft,
      residence.petFriendly,
      residence.disabledFriendly,
      residence.featuredImage
        ? new MediaResponse(
            residence.featuredImage.id,
            residence.featuredImage.originalFileName,
            residence.featuredImage.mimeType,
            residence.featuredImage.uploadStatus,
            residence.featuredImage.size,
            residence.featuredImage.securedUrl
          )
        : null
    );
  }
}

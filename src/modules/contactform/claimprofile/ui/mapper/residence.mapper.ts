import { MediaResponse } from 'src/modules/media/ui/response/media.response';
import { ResidenceResponse } from '../response/residence.response';
import { Residence } from '../../domain/residence.entity';

export class ResidenceMapper {
  static toResponse(residence: Residence): ResidenceResponse {
    return new ResidenceResponse(
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

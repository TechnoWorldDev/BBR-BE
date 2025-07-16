import { MediaResponse } from 'src/modules/media/ui/response/media.response';
import { HighlightedAmenityResponse } from '../response/highlighted-amenities.response';
import { AmenityMapper } from 'src/modules/residentmanagement/amenity/ui/mapper/amenity.ui.mapper';

export class HighlightedAmenityMapper {
  static toResponse(highlightedAmenity: any): any {
    return new HighlightedAmenityResponse(
      highlightedAmenity.amenity ? AmenityMapper.toResponse(highlightedAmenity.amenity) : null,
      highlightedAmenity.order
    );
  }
}

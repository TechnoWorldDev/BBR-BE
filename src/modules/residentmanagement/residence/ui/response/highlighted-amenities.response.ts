import { AmenityResponse } from 'src/modules/residentmanagement/amenity/ui/response/amenity.response';

export class HighlightedAmenityResponse {
  constructor(
    public readonly amenity: AmenityResponse | null,
    public readonly order?: number
  ) {}
}

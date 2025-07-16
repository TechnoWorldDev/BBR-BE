import { BrandResponse } from 'src/modules/brand/ui/response/brand-response';
import { MediaResponse } from 'src/modules/media/ui/response/media.response';
import { AmenityResponse } from 'src/modules/residentmanagement/amenity/ui/response/amenity.response';
import { KeyFeatureResponse } from 'src/modules/residentmanagement/key_feature/ui/response/key-feature.response';
import { CityResponse } from 'src/modules/shared/city/ui/response/city.response';
import { CountryResponse } from 'src/modules/shared/country/ui/response/country.response';
import { DevelopmentStatusEnum } from 'src/shared/types/development-status.enum';
import { RentalPotentialEnum } from 'src/shared/types/rental-potential.enum';
import { ResidenceStatusEnum } from '../../domain/residence-status.enum';
import { HighlightedAmenityResponse } from './highlighted-amenities.response';
import { ResidenceTotalScoreResponse } from './residence-total-score.response';
import { UnitResponse } from './unit.response';
import { CompanyResponse } from './company.response';

export class ResidenceResponse {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly slug: string,
    public readonly status: ResidenceStatusEnum,
    public readonly developmentStatus: DevelopmentStatusEnum,
    public readonly subtitle: string,
    public readonly description: string,
    public readonly budgetStartRange: number,
    public readonly budgetEndRange: number,
    public readonly address: string,
    public readonly latitude: string,
    public readonly longitude: string,
    public readonly country: CountryResponse,
    public readonly city: CityResponse,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly rentalPotential?: RentalPotentialEnum,
    public readonly websiteUrl?: string,
    public readonly yearBuilt?: string,
    public readonly floorSqft?: number,
    public readonly staffRatio?: number,
    public readonly avgPricePerUnit?: number,
    public readonly avgPricePerSqft?: number,
    public readonly petFriendly?: boolean,
    public readonly disabledFriendly?: boolean,
    public readonly videoTourUrl?: string,
    public readonly videoTour?: MediaResponse | null,
    public readonly featuredImage?: MediaResponse | null,
    public readonly keyFeatures?: KeyFeatureResponse[] | [],
    public readonly brand?: BrandResponse | null,
    public readonly units?: UnitResponse[] | [],
    public readonly amenities?: AmenityResponse[] | [],
    public readonly company?: CompanyResponse | null,
    public readonly mainGallery?: MediaResponse[] | [],
    public readonly secondaryGallery?: MediaResponse[] | [],
    public readonly highlightedAmenities?: HighlightedAmenityResponse[] | [],
    public readonly totalScores?: ResidenceTotalScoreResponse[],
    public readonly rankingScores?: any[]
  ) {}
}

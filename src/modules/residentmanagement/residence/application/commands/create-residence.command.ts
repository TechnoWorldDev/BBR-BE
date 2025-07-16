import { DevelopmentStatusEnum } from 'src/shared/types/development-status.enum';
import { RentalPotentialEnum } from 'src/shared/types/rental-potential.enum';
import { HighlightedAmenityType } from '../../ui/types/highlighted-amenities.type';

export class CreateResidenceCommand {
  constructor(
    public readonly name?: string,
    public readonly slug?: string,
    public readonly websiteUrl?: string,
    public readonly subtitle?: string,
    public readonly description?: string,
    public readonly budgetStartRange?: number,
    public readonly budgetEndRange?: number,
    public readonly address?: string,
    public readonly latitude?: string,
    public readonly longitude?: string,
    public readonly brandId?: string,
    public readonly countryId?: string,
    public readonly cityId?: string,
    public readonly rentalPotential?: RentalPotentialEnum,
    public readonly developmentStatus?: DevelopmentStatusEnum,
    public readonly yearBuilt?: string,
    public readonly floorSqft?: number,
    public readonly staffRatio?: number,
    public readonly avgPricePerUnit?: number,
    public readonly avgPricePerSqft?: number,
    public readonly petFriendly?: boolean,
    public readonly disabledFriendly?: boolean,
    public readonly videoTourUrl?: string,
    public readonly videoTourId?: string,
    public readonly featuredImageId?: string,
    public readonly keyFeatures?: string[],
    public readonly amenities?: string[],
    public readonly companyId?: string,
    public readonly mainGallery?: { id: string; order: number }[],
    public readonly secondaryGallery?: { id: string; order: number }[],
    public readonly highlightedAmenities?: HighlightedAmenityType[]
  ) {}
}

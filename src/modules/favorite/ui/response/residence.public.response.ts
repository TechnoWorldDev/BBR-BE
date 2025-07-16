import { Media } from 'src/modules/media/domain/media.entity';
import { MediaResponse } from 'src/modules/media/ui/response/media.response';
import { ResidenceStatusEnum } from 'src/modules/residentmanagement/residence/domain/residence-status.enum';
import { DevelopmentStatusEnum } from 'src/shared/types/development-status.enum';
import { RentalPotentialEnum } from 'src/shared/types/rental-potential.enum';

export class ResidencePublicResponse {
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
    public readonly featuredImage?: MediaResponse | null
  ) {}
}

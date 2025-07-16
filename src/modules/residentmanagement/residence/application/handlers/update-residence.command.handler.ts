import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IBrandRepository } from 'src/modules/brand/domain/brand.repository.interface';
import { ICompanyRepository } from 'src/modules/company/domain/company.repository.interface';
import { IMediaRepository } from 'src/modules/media/domain/media.repository.interface';
import { IAmenityRepository } from 'src/modules/residentmanagement/amenity/domain/amenity.repository.interface';
import { IKeyFeatureRepository } from 'src/modules/residentmanagement/key_feature/domain/key-feature.repository.interface';
import { ICityRepository } from 'src/modules/shared/city/domain/city.repository.interface';
import { ICountryRepository } from 'src/modules/shared/country/domain/country.repository.interface';
import { Residence } from '../../domain/residence.entity';
import { IResidenceRepository } from '../../domain/residence.repository.interface';
import { UpdateResidenceCommand } from '../commands/update-residence.command';
import { ResidenceStatusEnum } from '../../domain/residence-status.enum';
import { log } from 'console';
import { logger } from 'handlebars';
import { PermissionsEnum } from 'src/shared/types/permissions.enum';

@Injectable()
export class UpdateResidenceCommandHandler {
  constructor(
    private readonly residenceRepository: IResidenceRepository,
    private readonly countryRepository: ICountryRepository,
    private readonly cityRepository: ICityRepository,
    private readonly mediaRepository: IMediaRepository,
    private readonly companyRepository: ICompanyRepository,
    private readonly brandRepository: IBrandRepository,
    private readonly amenityRepository: IAmenityRepository,
    private readonly keyFeatureRepository: IKeyFeatureRepository
  ) {}

  async handle(command: UpdateResidenceCommand): Promise<Residence> {
    const residence = await this.residenceRepository.findById(command.id);

    const hasFullPermission = command.loggedUser?.role.permissions?.includes(
      PermissionsEnum.RESIDENCES_UPDATE
    );
    const hasOwnPermission = command.loggedUser?.role.permissions?.includes(
      PermissionsEnum.RESIDENCES_UPDATE_OWN
    );

    if (!residence) {
      throw new NotFoundException('Residence not found');
    }

    let status = residence.status;

    if (hasOwnPermission && !hasFullPermission) {
      if (residence?.company?.id !== command.loggedUser?.company?.id) {
        throw new ForbiddenException('You can only update your own residences.');
      }

      if (command.companyId && command.companyId !== residence.companyId) {
        throw new ForbiddenException('Developers are not allowed to change companyId.');
      }

      status = ResidenceStatusEnum.PENDING;
    }

    if (command.countryId) {
      const country = await this.countryRepository.findById(command.countryId!);

      if (!country) {
        throw new NotFoundException('Country not found');
      }
    }

    if (command.cityId) {
      const city = await this.cityRepository.findById(command.cityId);

      if (!city) {
        throw new NotFoundException('City not found');
      }
    }

    if (command.featuredImageId) {
      const media = await this.mediaRepository.findById(command.featuredImageId!);

      if (!media) {
        throw new NotFoundException('Media not found');
      }
    }

    if (command.brandId) {
      const brand = await this.brandRepository.findById(command.brandId!);

      if (!brand) {
        throw new NotFoundException('Brand not found');
      }
    }

    if (command.companyId) {
      const company = await this.companyRepository.findById(command.companyId!);

      if (!company) {
        throw new NotFoundException('Company not found');
      }
    }

    if (command.amenities?.length) {
      const amenities = await this.amenityRepository.validateAndFetchByIds(command.amenities);
      await residence.$relatedQuery('amenities').unrelate();
      await residence.$relatedQuery('amenities').relate(amenities.map((amenityId) => amenityId.id));
    }

    if (command.keyFeatures?.length) {
      const keyFeatures = await this.keyFeatureRepository.validateAndFetchByIds(
        command.keyFeatures
      );
      await residence.$relatedQuery('keyFeatures').unrelate();
      await residence
        .$relatedQuery('keyFeatures')
        .relate(keyFeatures.map((keyFeatureId) => keyFeatureId.id));
    }

    if (command.mainGallery?.length) {
      await this.residenceRepository.syncOrderedMediaGallery(
        command.id,
        command.mainGallery,
        'mainGallery'
      );
    }

    if (command.secondaryGallery?.length) {
      await this.residenceRepository.syncOrderedMediaGallery(
        command.id,
        command.secondaryGallery,
        'secondaryGallery'
      );
    }

    if (command.highlightedAmenities) {
      await this.residenceRepository.clearHighlightedAmenities(residence.id);

      const amenityIdSet = new Set<string>();
      for (const highlighted of command.highlightedAmenities) {
        if (amenityIdSet.has(highlighted.id)) {
          throw new ConflictException(`Duplicate amenityId in highlighted amenities`);
        }
        amenityIdSet.add(highlighted.id);
      }

      for (const highlighted of command.highlightedAmenities) {
        const { id, order } = highlighted;

        const exists = await this.amenityRepository.findById(id);
        if (!exists) {
          throw new NotFoundException(`Highlighted amenity not found`);
        }

        await this.residenceRepository.addHighlightedAmenity({
          residenceId: residence.id,
          amenityId: id,
          order,
        });
      }
    }

    let slug = residence.slug;
    if (command.slug && command.slug !== residence.slug) {
      const rawSlug = command.slug?.trim();
      slug = Residence.slugify(rawSlug);

      const existing = await this.residenceRepository.findBySlug(slug);
      if (existing && existing.id !== command.id) {
        throw new ConflictException(`Residence with slug ${slug} already exists`);
      }
    }

    const updateResidence = {
      name: command.name,
      slug: slug,
      websiteUrl: command.websiteUrl,
      subtitle: command.subtitle,
      description: command.description,
      budgetStartRange: command.budgetStartRange,
      budgetEndRange: command.budgetEndRange,
      address: command.address,
      latitude: command.latitude,
      longitude: command.longitude,
      brandId: command.brandId,
      countryId: command.countryId,
      cityId: command.cityId,
      rentalPotential: command.rentalPotential,
      developmentStatus: command.developmentStatus,
      yearBuilt: command.yearBuilt,
      floorSqft: command.floorSqft,
      staffRatio: command.staffRatio,
      avgPricePerUnit: command.avgPricePerUnit,
      avgPricePerSqft: command.avgPricePerSqft,
      petFriendly: command.petFriendly,
      disabledFriendly: command.disabledFriendly,
      videoTourUrl: command.videoTourUrl,
      videoTourId: command.videoTourId,
      featuredImageId: command.featuredImageId,
      companyId: command.companyId,
      status,
    };

    const updated = await this.residenceRepository.update(command.id, updateResidence);

    if (!updated) {
      throw new InternalServerErrorException('Residence not found');
    }

    return updated;
  }
}

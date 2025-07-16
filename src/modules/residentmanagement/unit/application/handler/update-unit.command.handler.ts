import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { IUnitRepository } from '../../domain/unit.repository.interface';
import { IMediaRepository } from 'src/modules/media/domain/media.repository.interface';
import { UpdateUnitCommand } from '../command/update-unit.command';
import { Unit } from '../../domain/unit.entity';
import { IResidenceRepository } from '../../domain/residence.repository.interface';
import { IUnitTypeRepository } from '../../../unit_type/domain/unit-type.repository.interface';
import { User } from 'src/modules/user/domain/user.entity';
import { PermissionsEnum } from 'src/shared/types/permissions.enum';
import { UnitStatusEnum } from '../../domain/unit-status.enum';

@Injectable()
export class UpdateUnitCommandHandler {
  constructor(
    private readonly unitRepository: IUnitRepository,
    private readonly residenceRepository: IResidenceRepository,
    private readonly mediaRepository: IMediaRepository,
    private readonly unitTypeRepository: IUnitTypeRepository
  ) {}

  @LogMethod()
  async handle(user: User, command: UpdateUnitCommand): Promise<Unit> {
    const hasOwnPermission = user?.role.permissions?.includes(PermissionsEnum.UNITS_UPDATE_OWN);

    const residence = await this.residenceRepository.findById(command.residenceId);
    if (!residence) {
      throw new NotFoundException('Residence not found');
    }

    if (hasOwnPermission && residence.company.id !== user.company?.id) {
      throw new ForbiddenException('You do not have permission to update this unit.');
    }

    const existingUnit = await this.unitRepository.findById(command.id);

    if (!existingUnit) {
      throw new NotFoundException('Unit not found');
    }

    const unitType = await this.unitTypeRepository.findById(command.unitTypeId);
    if (!unitType) {
      throw new NotFoundException('Unit type not found');
    }

    const featureImage = await this.mediaRepository.findById(command.featureImageId);
    if (!featureImage) {
      throw new NotFoundException('Feature image not found');
    }

    const galleryMedia = await this.mediaRepository.findByIds(command.galleryMediaIds);

    if (galleryMedia.length !== command.galleryMediaIds.length) {
      const foundIds = galleryMedia.map((media) => media.id);
      const missingIds = command.galleryMediaIds.filter((id) => !foundIds.includes(id));
      throw new NotFoundException(`Gallery image(s) not found for id(s): ${missingIds.join(', ')}`);
    }

    let slug = existingUnit.slug;
    if (command.slug && command.slug !== existingUnit.slug) {
      const rawSlug = command.slug?.trim() ?? command.name!;
      slug = Unit.slugify(rawSlug);

      const existing = await this.unitRepository.findBySlug(slug);
      if (existing && existing.id !== command.id) {
        throw new ConflictException(`Unit with slug ${slug} already exists`);
      }
    }

    const updateData: Partial<Unit> = {
      name: command.name,
      slug: slug,
      description: command.description,
      surface: command.surface,
      status: hasOwnPermission ? UnitStatusEnum.PENDING : command.status,
      regularPrice: command.regularPrice,
      exclusivePrice: command.exclusivePrice,
      exclusiveOfferStartDate: command.exclusiveOfferStartDate,
      exclusiveOfferEndDate: command.exclusiveOfferEndDate,
      roomType: command.roomType,
      roomAmount: command.roomAmount,
      unitType: unitType,
      services: command.services,
      featureImage: featureImage,
      residence: residence,
      gallery: galleryMedia,
      about: command.about,
      bathrooms: command.bathrooms,
      bedroom: command.bedroom,
      floor: command.floor,
      transactionType: command.transactionType,
      characteristics: command.characteristics,
    };

    const updatedUnit = await this.unitRepository.update(existingUnit.id, updateData);
    if (!updatedUnit) {
      throw new InternalServerErrorException('Unit could not be updated');
    }

    return updatedUnit;
  }
}

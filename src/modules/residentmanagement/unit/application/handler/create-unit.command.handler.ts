import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { EmailAction } from 'src/modules/email/domain/email-action.enum';
import { IMediaRepository } from 'src/modules/media/domain/media.repository.interface';
import { User } from 'src/modules/user/domain/user.entity';
import { LogMethod } from 'src/shared/infrastructure/logger/log.decorator';
import { PermissionsEnum } from 'src/shared/types/permissions.enum';
import { IUnitTypeRepository } from '../../../unit_type/domain/unit-type.repository.interface';
import { IResidenceRepository } from '../../domain/residence.repository.interface';
import { UnitStatusEnum } from '../../domain/unit-status.enum';
import { Unit } from '../../domain/unit.entity';
import { IUnitRepository } from '../../domain/unit.repository.interface';
import { CreateUnitCommand } from '../command/create-unit.command';
import { EmailQueue } from 'src/modules/email/infrastructure/queues/email.queue';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CreateUnitCommandHandler {
  constructor(
    private readonly unitRepository: IUnitRepository,
    private readonly mediaRepository: IMediaRepository,
    private readonly residenceRepository: IResidenceRepository,
    private readonly unitTypeRepository: IUnitTypeRepository,
    private readonly emailQueue: EmailQueue,
    private readonly configService: ConfigService
  ) {}

  @LogMethod()
  async handle(user: User, command: CreateUnitCommand): Promise<Unit> {
    let residence;

    const hasOwnPermission = user?.role.permissions?.includes(PermissionsEnum.UNITS_CREATE_OWN);

    if (hasOwnPermission) {
      residence = await this.residenceRepository.findByIdAndCompanyId(
        command.residenceId,
        user.company?.id!
      );
    } else {
      residence = await this.residenceRepository.findById(command.residenceId);
    }

    if (!residence) {
      throw new NotFoundException('Residence not found');
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

    const rawSlug = command.slug?.trim() ?? command.name!;
    let slug = Unit.slugify(rawSlug);

    const existingSlug = await this.unitRepository.findBySlug(slug);
    if (existingSlug) {
      // throw new ConflictException(`Unit with slug ${slug} already exists`);
      slug += `-${Math.random().toString(36).substring(2, 7)}`;
    }

    const unitData: Partial<Unit> = {
      name: command.name,
      slug,
      description: command.description,
      surface: command.surface,
      status: hasOwnPermission ? UnitStatusEnum.PENDING : UnitStatusEnum.ACTIVE,
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

    const createdUnit = await this.unitRepository.create(unitData);

    if (!createdUnit) {
      throw new InternalServerErrorException('Unit could not be saved');
    }

    if (hasOwnPermission) {
      await this.emailQueue.addEmailJob(EmailAction.REGISTER_UNIT, {
        to: user.email,
        variables: {
          fullName: `${user.fullName}`,
          unitName: `${createdUnit.name}`,
          manageResidencesLink: `${this.configService.get<string>('FRONTEND_URL')}/developer/residences`,
        },
      });
    }

    return createdUnit;
  }
}

import { MediaResponse } from 'src/modules/media/ui/response/media.response';
import { ResidenceResponse } from '../response/residence.response'; // Import the ResidenceResponse
import { Unit } from '../../domain/unit.entity';
import { UnitResponse } from '../response/unit.response';
import { CreateUnitRequest } from '../request/create-unit.request';
import { CreateUnitCommand } from '../../application/command/create-unit.command';
import { UpdateUnitRequest } from '../request/update-unit.request';
import { UpdateUnitCommand } from '../../application/command/update-unit.command';
import { UnitTypeResponse } from '../../../unit_type/ui/response/unit-type.response';
import { UnitPublicResponse } from '../response/unit.public.response';

export class UnitMapper {
  static toCreateCommand(request: CreateUnitRequest): CreateUnitCommand {
    return new CreateUnitCommand(
      request.name,
      request.slug,
      request.description,
      request.surface,
      request.status,
      request.regularPrice,
      request.exclusivePrice,
      request.exclusiveOfferStartDate,
      request.exclusiveOfferEndDate,
      request.roomType,
      request.roomAmount,
      request.unitTypeId,
      request.services,
      request.featureImageId,
      request.residenceId,
      request.galleryMediaIds,
      request.about,
      request.bathrooms,
      request.bedroom,
      request.floor,
      request.transactionType,
      request.characteristics
    );
  }

  static toUpdateCommand(id: string, request: UpdateUnitRequest): UpdateUnitCommand {
    return new UpdateUnitCommand(
      id,
      request.name,
      request.slug,
      request.description,
      request.surface,
      request.status,
      request.regularPrice,
      request.exclusivePrice,
      request.exclusiveOfferStartDate,
      request.exclusiveOfferEndDate,
      request.roomType,
      request.roomAmount,
      request.unitTypeId,
      request.services,
      request.featureImageId,
      request.residenceId,
      request.galleryMediaIds,
      request.about,
      request.bathrooms,
      request.bedroom,
      request.floor,
      request.transactionType,
      request.characteristics
    );
  }

  static toResponse(unit: Unit): UnitResponse {
    return new UnitResponse(
      unit.id,
      unit.name,
      unit.slug,
      unit.description,
      unit.surface,
      unit.status,
      unit.regularPrice,
      unit.exclusivePrice,
      unit.exclusiveOfferStartDate,
      unit.exclusiveOfferEndDate,
      unit.roomType,
      unit.roomAmount,
      new UnitTypeResponse(
        unit.unitType.id,
        unit.unitType.name,
        unit.unitType.createdAt,
        unit.unitType.updatedAt
      ),
      unit.serviceType,
      unit.serviceAmount,
      unit.services,
      unit.gallery
        ? unit.gallery.map(
            (media) =>
              new MediaResponse(
                media.id,
                media.originalFileName,
                media.mimeType,
                media.uploadStatus,
                media.size,
                media.securedUrl
              )
          )
        : [],
      unit.featureImage
        ? new MediaResponse(
            unit.featureImage.id,
            unit.featureImage.originalFileName,
            unit.featureImage.mimeType,
            unit.featureImage.uploadStatus,
            unit.featureImage.size,
            unit.featureImage.securedUrl
          )
        : null,
      unit.residence
        ? new ResidenceResponse(
            unit.residence.id,
            unit.residence.name,
            unit.residence.status,
            unit.residence.developmentStatus,
            unit.residence.subtitle,
            unit.residence.description,
            unit.residence.budgetStartRange,
            unit.residence.budgetEndRange,
            unit.residence.address,
            unit.residence.longitude,
            unit.residence.latitude
          )
        : null,
      unit.about,
      unit.bathrooms,
      unit.bedroom,
      unit.floor,
      unit.transactionType,
      unit.characteristics,
      unit.createdAt,
      unit.updatedAt
    );
  }

  static toPublicResponse(unit: Unit): UnitPublicResponse {
    return new UnitPublicResponse(
      unit.id,
      unit.name,
      unit.slug,
      unit.description,
      unit.surface,
      unit.status,
      unit.regularPrice,
      unit.exclusivePrice,
      unit.exclusiveOfferStartDate,
      unit.exclusiveOfferEndDate,
      unit.roomType,
      unit.roomAmount,
      new UnitTypeResponse(
        unit.unitType.id,
        unit.unitType.name,
        unit.unitType.createdAt,
        unit.unitType.updatedAt
      ),
      unit.serviceType,
      unit.serviceAmount,
      unit.services,
      unit.gallery
        ? unit.gallery.map(
            (media) =>
              new MediaResponse(
                media.id,
                media.originalFileName,
                media.mimeType,
                media.uploadStatus,
                media.size,
                media.securedUrl
              )
          )
        : [],
      unit.featureImage
        ? new MediaResponse(
            unit.featureImage.id,
            unit.featureImage.originalFileName,
            unit.featureImage.mimeType,
            unit.featureImage.uploadStatus,
            unit.featureImage.size,
            unit.featureImage.securedUrl
          )
        : null,
      unit.residence
        ? new ResidenceResponse(
            unit.residence.id,
            unit.residence.name,
            unit.residence.status,
            unit.residence.developmentStatus,
            unit.residence.subtitle,
            unit.residence.description,
            unit.residence.budgetStartRange,
            unit.residence.budgetEndRange,
            unit.residence.address,
            unit.residence.longitude,
            unit.residence.latitude
          )
        : null,
      unit.about,
      unit.bathrooms,
      unit.bedroom,
      unit.floor,
      unit.transactionType,
      unit.characteristics,
      unit.createdAt,
      unit.updatedAt
    );
  }
}

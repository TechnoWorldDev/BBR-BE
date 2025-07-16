import { Unit } from '../../domain/unit.entity';
import { UnitResponse } from '../response/unit.response';
import { MediaResponse } from 'src/modules/media/ui/response/media.response';

export class UnitMapper {
  static toResponse(unit: Unit): UnitResponse {
    return new UnitResponse(
      unit.id,
      unit.name,
      unit.description,
      unit.surface,
      unit.status,
      unit.regularPrice,
      unit.exclusivePrice,
      unit.exclusiveOfferStartDate,
      unit.exclusiveOfferEndDate,
      unit.roomType,
      unit.roomAmount,
      unit.type,
      unit.serviceType,
      unit.serviceAmount,
      unit.featureImage
        ? new MediaResponse(
            unit.featureImage.id,
            unit.featureImage.originalFileName,
            unit.featureImage.mimeType,
            unit.featureImage.uploadStatus,
            unit.featureImage.size,
            unit.featureImage.securedUrl
          )
        : null
    );
  }
}

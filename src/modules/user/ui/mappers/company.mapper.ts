import { MediaResponse } from 'src/modules/media/ui/response/media.response';
import { Company } from '../../domain/company.entity';
import { CompanyResponse } from '../response/company.response';
import { PlanMapper } from './plan.mapper';

export class CompanyMapper {
  static toResponse(company: Company): CompanyResponse {
    return new CompanyResponse(
      company.id,
      company.name,
      company.address,
      company.image
        ? new MediaResponse(
            company.image.id,
            company.image.originalFileName,
            company.image.mimeType,
            company.image.uploadStatus,
            company.image.size,
            company.image.securedUrl
          )
        : null,
      company.phoneNumber,
      company.phoneNumberCountryCode,
      company.website,
      company.contactPersonAvatar
        ? new MediaResponse(
            company.contactPersonAvatar.id,
            company.contactPersonAvatar.originalFileName,
            company.contactPersonAvatar.mimeType,
            company.contactPersonAvatar.uploadStatus,
            company.contactPersonAvatar.size,
            company.contactPersonAvatar.securedUrl
          )
        : null,
      company.contactPersonFullName,
      company.contactPersonJobTitle,
      company.contactPersonEmail,
      company.contactPersonPhoneNumber,
      company.contactPersonPhoneNumberCountryCode,
      company.plan && company.plan.id ? PlanMapper.toResponse(company.plan) : null
    );
  }
}

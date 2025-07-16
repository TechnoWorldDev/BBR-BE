import { MediaResponse } from 'src/modules/media/ui/response/media.response';
import { BrandTypeResponse } from '../response/brand-type.response';
import { BrandType } from '../../domain/brand-type.entity';
import { BrandResponse } from 'src/modules/brand/ui/response/brand-response';
import { Brand } from 'src/modules/brand/domain/brand.entity';
import { BrandTypePublicResponse } from '../response/brand-type.public.response';
import { BrandPublicResponse } from '../../../brand/ui/response/brand.public.response';

export class BrandTypeMapper {
  static toResponse(brandType: BrandType): BrandTypeResponse {
    return new BrandTypeResponse(
      brandType.id,
      brandType.name,
      brandType.description,
      brandType.createdAt,
      brandType.updatedAt,
      brandType.brands
        ? brandType.brands.map(
            (brand: Brand) =>
              new BrandResponse(
                brand.id,
                brand.name,
                brand.slug,
                brand.description,
                brand.status,
                brand.createdAt,
                brand.updatedAt,
                brand.brandType,
                brand.logo
                  ? new MediaResponse(
                      brand.logo.id,
                      brand.logo.originalFileName,
                      brand.logo.mimeType,
                      brand.logo.uploadStatus,
                      brand.logo.size,
                      brand.logo.securedUrl
                    )
                  : null
              )
          )
        : []
    );
  }

  static toPublicResponse(brandType: BrandType): BrandTypePublicResponse {
    return new BrandTypePublicResponse(
      brandType.id,
      brandType.name,
      brandType.description,
      brandType.createdAt,
      brandType.updatedAt,
      brandType.brands
        ? brandType.brands.map(
            (brand: Brand) =>
              new BrandPublicResponse(
                brand.id,
                brand.name,
                brand.slug,
                brand.description,
                brand.status,
                brand.createdAt,
                brand.updatedAt,
                brand.brandType,
                brand.logo
                  ? new MediaResponse(
                      brand.logo.id,
                      brand.logo.originalFileName,
                      brand.logo.mimeType,
                      brand.logo.uploadStatus,
                      brand.logo.size,
                      brand.logo.securedUrl
                    )
                  : null
              )
          )
        : []
    );
  }
}

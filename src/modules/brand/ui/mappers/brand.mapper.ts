import { MediaResponse } from 'src/modules/media/ui/response/media.response';
import { Brand } from '../../domain/brand.entity';
import { BrandResponse } from '../response/brand-response';
import { BrandPublicResponse } from '../response/brand.public.response';

export class BrandMapper {
  static toResponse(brand: Brand): BrandResponse {
    return new BrandResponse(
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
    );
  }

  static toPublicResponse(brand: Brand): BrandPublicResponse {
    return new BrandResponse(
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
    );
  }
}

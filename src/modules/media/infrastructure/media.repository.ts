import { Injectable } from '@nestjs/common';
import { IMediaRepository } from '../domain/media.repository.interface';
import { Media } from '../domain/media.entity';
import { MediaUploadStatus } from '../domain/media-upload-status.enum';
import { KnexService } from 'src/shared/infrastructure/database/knex.service';

@Injectable()
export class MediaRepositoryImpl implements IMediaRepository {
  constructor(private readonly knexService: KnexService) {}

  async create(media: Media): Promise<Media> {
    return await Media.query().insert(media);
  }

  async findById(id: string): Promise<Media | undefined> {
    return await Media.query().findById(id);
  }

  async findByIds(ids: string[]): Promise<Media[]> {
    return await Media.query().whereIn('id', ids);
  }

  async findActiveById(id: string): Promise<Media | null> {
    const media = await Media.query().where('id', id).whereNull('deletedAt').first();
    return media || null;
  }

  async updateExternalId(id: string, externalId: string): Promise<void> {
    await Media.query().where('id', id).whereNull('deletedAt').update({
      externalId,
      updatedAt: new Date(),
    });
  }

  async updateUploadStatus(id: string, uploadStatus: MediaUploadStatus): Promise<void> {
    await Media.query().where('id', id).whereNull('deletedAt').update({
      uploadStatus,
      updatedAt: new Date(),
    });
  }

  async fetchUnusedMediaCreatedAfter(date: Date): Promise<Media[]> {
    const rawMediaList = await this.knexService
      .connection('media')
      .select('media.*')
      .leftJoin('brands', 'brands.logo_id', 'media.id')
      .leftJoin('companies', 'companies.image_id', 'media.id')
      .leftJoin(
        'companies as companies_avatar',
        'companies_avatar.contact_person_avatar_id',
        'media.id'
      )
      .leftJoin('career_contact_forms', 'career_contact_forms.cv_id', 'media.id')
      .leftJoin('amenities', 'amenities.icon_id', 'media.id')
      .leftJoin('ranking_categories', 'ranking_categories.featured_image_id', 'media.id')
      .leftJoin('residences', 'residences.featured_image_id', 'media.id')
      .leftJoin('residences as residences_video', 'residences_video.video_tour_id', 'media.id')
      .leftJoin('residence_media', 'residence_media.media_id', 'media.id')
      .leftJoin('unit_gallery', 'unit_gallery.media_id', 'media.id')
      .leftJoin('units', 'units.feature_image_id', 'media.id')
      .leftJoin('user_buyers', 'user_buyers.image_id', 'media.id')
      .leftJoin('contact_forms', 'contact_forms.attachmentId', 'media.id')
      .leftJoin('claim_profile_contact_forms', 'claim_profile_contact_forms.cv_id', 'media.id')
      .whereNull('media.deleted_at')
      .whereNull('brands.logo_id')
      .whereNull('companies.image_id')
      .whereNull('companies_avatar.contact_person_avatar_id')
      .whereNull('career_contact_forms.cv_id')
      .whereNull('amenities.icon_id')
      .whereNull('ranking_categories.featured_image_id')
      .whereNull('residences.featured_image_id')
      .whereNull('residences_video.video_tour_id')
      .whereNull('residence_media.media_id')
      .whereNull('unit_gallery.media_id')
      .whereNull('units.feature_image_id')
      .whereNull('user_buyers.image_id')
      .whereNull('contact_forms.attachmentId')
      .whereNull('claim_profile_contact_forms.cv_id')
      .andWhere('media.created_at', '>', date)
      .whereNull('media.deleted_at');

    return rawMediaList.map((data) => Media.fromJson(data));
  }

  async deleteByIds(ids: string[]): Promise<void> {
    await Media.query().whereIn('id', ids).update({
      deletedAt: new Date(),
    });
  }
}

import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { Residence } from './residence.entity';
import { FetchResidencesQuery } from '../application/commands/fetch-residences.query';
import { FetchResidencesUnassignedToCategoryQuery } from '../application/commands/fetch-residences-unassigned-to-category.query';
import { User } from 'src/modules/user/domain/user.entity';

export abstract class IResidenceRepository {
  abstract create(residence: Partial<Residence>): Promise<Residence | undefined>;
  abstract update(id: string, data: Partial<Residence>): Promise<Residence | undefined>;
  abstract delete(id: string): Promise<void>;
  abstract findById(id: string): Promise<Residence | undefined>;
  abstract findBySlug(slug: string): Promise<Residence | undefined>;
  abstract findByName(name: string): Promise<Residence | undefined>;
  abstract findAll(
    query: FetchResidencesQuery
  ): Promise<{ data: Residence[]; pagination: PaginationResponse }>;
  abstract findAllByUser(
    user: User,
    query: FetchResidencesQuery
  ): Promise<{ data: Residence[]; pagination: PaginationResponse }>;
  abstract findAllUnassignedToCategory(
    rankingCategoryId: string,
    fetchQuery: FetchResidencesUnassignedToCategoryQuery
  ): Promise<{ data: Residence[]; pagination: PaginationResponse }>;
  abstract syncOrderedMediaGallery(
    residenceId: string,
    gallery: { id: string; order: number }[],
    type: 'mainGallery' | 'secondaryGallery'
  ): Promise<void>;
  abstract addHighlightedAmenity(data: {
    residenceId: string;
    amenityId: string;
    description?: string;
    featuredImageId?: string;
    order?: number;
  }): Promise<void>;
  abstract clearHighlightedAmenities(residenceId: string): Promise<void>;
  abstract findCriteriaForResidenceCategory(
    residenceId: string,
    rankingCategoryId: string
  ): Promise<any>;
}

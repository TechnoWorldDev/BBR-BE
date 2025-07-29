import { ApiProperty } from '@nestjs/swagger';
import { RankingCategory } from '../../domain/ranking-category.entity';

export class RankingCategoryPublicResponse {
  @ApiProperty({
    description: 'Ranking category ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  public readonly id: string;

  @ApiProperty({
    description: 'Ranking category name',
    example: 'Best Hotels'
  })
  public readonly name: string;

  @ApiProperty({
    description: 'Ranking category slug',
    example: 'best-hotels'
  })
  public readonly slug: string;

  @ApiProperty({
    description: 'Ranking category title',
    example: 'Best Hotels in the City'
  })
  public readonly title: string;

  @ApiProperty({
    description: 'Ranking category description',
    example: 'Top hotels in the city'
  })
  public readonly description: string;

  @ApiProperty({
    description: 'Ranking category price',
    example: 29.99
  })
  public readonly rankingPrice: number;

  @ApiProperty({
    description: 'Stripe price ID for this ranking category',
    example: 'price_1234567890',
    required: false
  })
  public readonly stripePriceId?: string;

  @ApiProperty({
    description: 'Ranking category type',
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'City',
      key: 'cities'
    }
  })
  public readonly rankingCategoryType: any;

  @ApiProperty({
    description: 'Featured image',
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      url: 'https://example.com/image.jpg'
    },
    required: false
  })
  public readonly featuredImage?: any;

  constructor(
    id: string,
    name: string,
    slug: string,
    title: string,
    description: string,
    rankingPrice: number,
    stripePriceId: string | undefined,
    rankingCategoryType: any,
    featuredImage?: any
  ) {
    this.id = id;
    this.name = name;
    this.slug = slug;
    this.title = title;
    this.description = description;
    this.rankingPrice = rankingPrice;
    this.stripePriceId = stripePriceId;
    this.rankingCategoryType = rankingCategoryType;
    this.featuredImage = featuredImage;
  }

  static fromEntity(entity: RankingCategory): RankingCategoryPublicResponse {
    return new RankingCategoryPublicResponse(
      entity.id,
      entity.name,
      entity.slug,
      entity.title,
      entity.description,
      entity.rankingPrice,
      entity.stripePriceId,
      entity.rankingCategoryType,
      entity.featuredImage
    );
  }
}

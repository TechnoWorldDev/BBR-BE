import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { OrderByDirection } from 'objection';
import { User } from 'src/modules/user/domain/user.entity';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { PaginationResponse } from 'src/shared/ui/response/pagination.response';
import { FetchFavoritesQuery } from '../application/command/fetch-favorites.query';
import { FetchAllFavoritesQueryHandler } from '../application/query/fetch-all-favorites.query.handler';
import { FavoriteMapper } from './mappers/favorite.mapper';
import { FavoriteResponse } from './response/favorite.response';
import { SessionAuthGuard } from 'src/shared/guards/session-auth.guard';
import { AddFavoriteCommandHandler } from '../application/handlers/add-favorite.command.handler';
import { AddFavoriteRequest } from './request/add-favorite.request';
import { AddFavoriteCommand } from '../application/command/add-favorite.command';
import { RemoveFavoriteCommandHandler } from '../application/handlers/remove-favorite.command.handler';
import { RemoveFavoriteCommand } from '../application/command/remove-favorite.command';

@ApiTags('Favorite')
@Controller('favorites')
export class FavoriteController {
  constructor(
    private readonly fetchAllFavoritesQueryHandler: FetchAllFavoritesQueryHandler,
    private readonly addFavoriteCommandHandler: AddFavoriteCommandHandler,
    private readonly removeFavoriteCommandHandler: RemoveFavoriteCommandHandler
  ) {}

  @Get()
  @ApiQuery({
    name: 'query',
    required: false,
    type: String,
    description: 'Search query for lifestyle name',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 10)',
  })
  @UseGuards(SessionAuthGuard)
  async findAll(
    @CurrentUser() user: User,
    @Query('query') query?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: OrderByDirection,
    @Query('entityType') entityType?: string[]
  ): Promise<{ data: FavoriteResponse[]; pagination: PaginationResponse }> {
    const fetchQuery = new FetchFavoritesQuery(query, page, limit, sortBy, sortOrder, entityType);
    const { data, pagination } = await this.fetchAllFavoritesQueryHandler.handle(
      user.id,
      fetchQuery
    );

    return {
      data: data.map((favorite) => FavoriteMapper.toResponse(favorite)),
      pagination,
    };
  }

  @Post()
  @UseGuards(SessionAuthGuard)
  async add(@CurrentUser() user: User, @Body() favoriteRequest: AddFavoriteRequest) {
    const command = new AddFavoriteCommand(favoriteRequest.entityId, favoriteRequest.entityType);
    return await this.addFavoriteCommandHandler.handle(user.id, command);
  }

  @Delete(':entityType/:entityId')
  @UseGuards(SessionAuthGuard)
  async remove(
    @CurrentUser() user: User,
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string
  ): Promise<void> {
    const command = new RemoveFavoriteCommand(entityType, entityId);
    return await this.removeFavoriteCommandHandler.handle(user.id, command);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { OrderByDirection } from 'objection';
import { User } from 'src/modules/user/domain/user.entity';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { SessionAuthGuard } from 'src/shared/guards/session-auth.guard';
import { PermissionsEnum } from 'src/shared/types/permissions.enum';
import { FetchReviewsQuery } from '../application/command/fetch-reviews.query';
import { UpdateReviewStatusCommand } from '../application/command/update-review-status.command';
import { CreateReviewCommandHandler } from '../application/handler/create-review-command.handler';
import { DeleteReviewCommandHandler } from '../application/handler/delete-review-command.handler';
import { UpdateReviewStatusCommandHandler } from '../application/handler/update-review-status-command.handler';
import { FetchReviewsCommandQuery } from '../application/query/fetch-reviews-command.query';
import { FindReviewByIdCommandQuery } from '../application/query/find-review-by-id-command.query';
import { Review } from '../domain/review.entity';
import { ReviewMapper } from './mapper/review.mapper';
import { CreateReviewRequest } from './request/create-review.request';
import { UpdateReviewStatusRequest } from './request/update-review-status.request';
import { ReviewResponse } from './response/review.response';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewController {
  constructor(
    private readonly fetchReviewsCommandQuery: FetchReviewsCommandQuery,
    private readonly findReviewByIdCommandQuery: FindReviewByIdCommandQuery,
    private readonly createReviewCommandHandler: CreateReviewCommandHandler,
    private readonly updateReviewStatusCommandHandler: UpdateReviewStatusCommandHandler,
    private readonly deleteReviewCommandHandler: DeleteReviewCommandHandler
  ) {}

  @Get()
  @UseGuards(SessionAuthGuard)
  @ApiOperation({ summary: 'Get all reviews' })
  @ApiResponse({ type: [ReviewResponse] })
  async fetchAll(
    @Req() req,
    @Query('query') query?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: OrderByDirection,
    @Query('residenceId') residenceId?: string[],
    @Query('userId') userId?: string[],
    @Query('status') status?: string[],
    @Query('unitTypeId') unitTypeId?: string[]
  ) {
    const user = req.user as User;
    let loggedDeveloperCompanyId: string | undefined = undefined;
    const hasOwnPermission = user?.role.permissions?.includes(PermissionsEnum.REVIEWS_READ_OWN);

    if (hasOwnPermission) {
      loggedDeveloperCompanyId = user.company?.id;
    }

    const { data, pagination } = await this.fetchReviewsCommandQuery.handle(
      new FetchReviewsQuery(
        query,
        page,
        limit,
        sortBy,
        sortOrder,
        status,
        residenceId,
        userId,
        unitTypeId,
        loggedDeveloperCompanyId
      )
    );

    const mapped = data.map((review: Review) => ReviewMapper.toResponse(review));

    return {
      data: mapped,
      pagination,
    };
  }

  @Get(':id')
  @UseGuards(SessionAuthGuard)
  @ApiOperation({ summary: 'Get review by ID' })
  @ApiResponse({ type: ReviewResponse })
  async findById(@Req() req, @Param('id') id: string) {
    const user = req.user as User;
    const review = await this.findReviewByIdCommandQuery.handle(user, id);

    return ReviewMapper.toResponse(review);
  }

  @Post()
  @UseGuards(SessionAuthGuard)
  @ApiOperation({ summary: 'Create a review' })
  @ApiResponse({ type: ReviewResponse })
  async create(@Body() createReviewRequest: CreateReviewRequest, @Req() req: Request) {
    const loggedUserId = (req.user as User).id;

    const command = ReviewMapper.toCreateCommand(loggedUserId, createReviewRequest);
    const created = await this.createReviewCommandHandler.handle(command);

    return ReviewMapper.toResponse(created);
  }

  @Patch(':id/status')
  @UseGuards(SessionAuthGuard)
  @Permissions(PermissionsEnum.SYSTEM_SUPERADMIN_UPDATE)
  @ApiOperation({ summary: 'Update review status' })
  async updateStatus(
    @Param('id') id: string,
    @Body() request: UpdateReviewStatusRequest,
    @Req() req
  ) {
    const result = await this.updateReviewStatusCommandHandler.handle(
      new UpdateReviewStatusCommand(id, request.status)
    );

    return ReviewMapper.toResponse(result);
  }

  @Delete(':id')
  @UseGuards(SessionAuthGuard)
  @Permissions(PermissionsEnum.SYSTEM_SUPERADMIN_DELETE)
  @ApiOperation({ summary: 'Delete a review' })
  async delete(@Param('id') id: string) {
    return this.deleteReviewCommandHandler.handle(id);
  }
}

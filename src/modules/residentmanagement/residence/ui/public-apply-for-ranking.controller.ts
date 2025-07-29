import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PublicApplyForRankingRequest } from './request/public-apply-for-ranking.request';
import { PublicApplyForRankingService } from '../services/public-apply-for-ranking.service';

@ApiTags('Public Apply For Ranking')
@Controller('public/apply-for-ranking')
export class PublicApplyForRankingController {
  constructor(private readonly publicApplyForRankingService: PublicApplyForRankingService) {}

  @Post()
  @ApiOperation({ summary: 'Apply for ranking as a new or existing user (anonymous)' })
  @ApiResponse({ status: 201, description: 'Ranking application processed' })
  async apply(@Body() body: PublicApplyForRankingRequest) {
    return this.publicApplyForRankingService.handle(body);
  }
} 
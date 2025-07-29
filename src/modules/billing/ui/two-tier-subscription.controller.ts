import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Permissions } from 'src/shared/decorators/permissions.decorator';
import { RBACGuard } from 'src/shared/guards/rbac.guard';
import { SessionAuthGuard } from 'src/shared/guards/session-auth.guard';
import { PermissionsEnum } from 'src/shared/types/permissions.enum';
import { TwoTierSubscriptionService } from '../application/services/two-tier-subscription.service';
import { CreateResidenceSubscriptionCheckoutRequest } from './requests/create-residence-subscription-checkout.request';
import { CreateRankingSubscriptionRequest } from './requests/create-ranking-subscription.request';
import { SubscriptionStatusResponse } from './responses/subscription-status.response';
import { SubscriptionProductResponse } from './responses/subscription-products.response';
import { CreateResidenceSubscriptionCommandHandler } from '../application/handlers/create-residence-subscription.command.handler';
import { CreateRankingSubscriptionCommandHandler } from '../application/handlers/create-ranking-subscription.command.handler';
import { CreateResidenceSubscriptionCommand } from '../application/commands/create-residence-subscription.command';
import { CreateRankingSubscriptionCommand } from '../application/commands/create-ranking-subscription.command';
import { RankingCategory } from 'src/modules/shared/rankingmanagement/category/domain/ranking-category.entity';

@ApiTags('Two-Tier Subscriptions')
@Controller('api/v1/subscriptions')
@UseGuards(SessionAuthGuard, RBACGuard)
export class TwoTierSubscriptionController {
  constructor(
    private readonly twoTierSubscriptionService: TwoTierSubscriptionService,
    private readonly createResidenceSubscriptionHandler: CreateResidenceSubscriptionCommandHandler,
    private readonly createRankingSubscriptionHandler: CreateRankingSubscriptionCommandHandler
  ) {}

  @Post('/residence')
  @Permissions(PermissionsEnum.BILLING_CREATE_OWN)
  @ApiOperation({ summary: 'Create a residence subscription' })
  @ApiResponse({ status: 201, description: 'Residence subscription checkout session created' })
  async createResidenceSubscription(
    @Body(ValidationPipe) request: CreateResidenceSubscriptionCheckoutRequest,
    @Req() req: any
  ) {
    const command = new CreateResidenceSubscriptionCommand(
      req.user.id,
      request.residenceId,
      request.successUrl,
      request.cancelUrl
    );

    const session = await this.createResidenceSubscriptionHandler.handle(command);
    return { checkoutUrl: session.url };
  }

  @Post('/ranking')
  @Permissions(PermissionsEnum.BILLING_CREATE_OWN)
  @ApiOperation({ summary: 'Create a ranking subscription' })
  @ApiResponse({ status: 201, description: 'Ranking subscription checkout session created' })
  async createRankingSubscription(
    @Body(ValidationPipe) request: CreateRankingSubscriptionRequest,
    @Req() req: any
  ) {
    const command = new CreateRankingSubscriptionCommand(
      req.user.id,
      request.residenceId,
      request.rankingCategoryId,
      request.successUrl,
      request.cancelUrl
    );

    const session = await this.createRankingSubscriptionHandler.handle(command);
    return { checkoutUrl: session.url };
  }

  @Get('/residence/:residenceId/status')
  @Permissions(PermissionsEnum.BILLING_READ_OWN)
  @ApiOperation({ summary: 'Get subscription status for a residence' })
  @ApiResponse({ type: SubscriptionStatusResponse })
  async getResidenceSubscriptionStatus(
    @Param('residenceId') residenceId: string,
    @Req() req: any
  ): Promise<SubscriptionStatusResponse> {
    const status = await this.twoTierSubscriptionService.getResidenceSubscriptionStatus(
      req.user.id,
      residenceId
    );

    return new SubscriptionStatusResponse(
      status.hasResidenceSubscription,
      status.hasRankingSubscriptions,
      status.totalRankingSubscriptions
    );
  }

  @Get('/products/residence')
  @Permissions(PermissionsEnum.BILLING_READ_OWN)
  @ApiOperation({ summary: 'Get residence subscription products' })
  @ApiResponse({ type: [SubscriptionProductResponse] })
  async getResidenceSubscriptionProducts(): Promise<SubscriptionProductResponse[]> {
    const products = await this.twoTierSubscriptionService.getSubscriptionProducts();
    
    return products.map(product => new SubscriptionProductResponse(
      product.id,
      product.name,
      product.description,
      product.amount,
      product.currency,
      product.interval,
      product.stripePriceId,
      'residence'
    ));
  }

  @Get('/products/ranking')
  @Permissions(PermissionsEnum.BILLING_READ_OWN)
  @ApiOperation({ summary: 'Get ranking subscription products' })
  @ApiResponse({ type: [SubscriptionProductResponse] })
  async getRankingSubscriptionProducts(): Promise<SubscriptionProductResponse[]> {
    const products = await this.twoTierSubscriptionService.getSubscriptionProducts();
    
    return products.map(product => new SubscriptionProductResponse(
      product.id,
      product.name,
      product.description,
      product.amount,
      product.currency,
      product.interval,
      product.stripePriceId,
      'ranking'
    ));
  }

  @Get('/ranking-categories')
  @Permissions(PermissionsEnum.BILLING_READ_OWN)
  @ApiOperation({ summary: 'Get available ranking categories for subscription' })
  @ApiResponse({ 
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          rankingPrice: { type: 'number' },
          stripePriceId: { type: 'string' },
          slug: { type: 'string' }
        }
      }
    }
  })
  async getAvailableRankingCategories(): Promise<any[]> {
    // Get active ranking categories that have stripe_price_id and can be subscribed to
    const rankingCategories = await RankingCategory.query()
      .where('status', 'ACTIVE')
      .whereNotNull('rankingPrice')
      .where('rankingPrice', '>', 0)
      .whereNotNull('stripePriceId')
      .select(['id', 'name', 'description', 'rankingPrice', 'stripePriceId', 'slug'])
      .orderBy('name');

    return rankingCategories.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description,
      rankingPrice: category.rankingPrice,
      stripePriceId: category.stripePriceId,
      slug: category.slug
    }));
  }

  @Get('/residence/:residenceId/validate-ranking')
  @Permissions(PermissionsEnum.BILLING_READ_OWN)
  @ApiOperation({ summary: 'Validate if user can apply for ranking' })
  @ApiResponse({ 
    schema: {
      type: 'object',
      properties: {
        canApply: { type: 'boolean' },
        reason: { type: 'string' }
      }
    }
  })
  async validateRankingApplication(
    @Param('residenceId') residenceId: string,
    @Req() req: any
  ) {
    return await this.twoTierSubscriptionService.validateRankingApplication(
      req.user.id,
      residenceId
    );
  }

  @Get('/residence/:residenceId/ranking-category/:rankingCategoryId/validate-application')
  @Permissions(PermissionsEnum.BILLING_READ_OWN)
  @ApiOperation({ summary: 'Validate if user can apply for specific ranking category' })
  @ApiResponse({ 
    schema: {
      type: 'object',
      properties: {
        canApply: { type: 'boolean' },
        reason: { type: 'string' },
        hasResidenceSubscription: { type: 'boolean' },
        hasRankingSubscription: { type: 'boolean' }
      }
    }
  })
  async validateRankingCategoryApplication(
    @Param('residenceId') residenceId: string,
    @Param('rankingCategoryId') rankingCategoryId: string,
    @Req() req: any
  ) {
    const userId = req.user.id;
    
    // Check residence subscription
    const hasResidenceSubscription = await this.twoTierSubscriptionService.hasActiveResidenceSubscription(
      userId,
      residenceId
    );

    if (!hasResidenceSubscription) {
      return {
        canApply: false,
        reason: 'Active residence subscription required to apply for ranking',
        hasResidenceSubscription: false,
        hasRankingSubscription: false
      };
    }

    // Check ranking category subscription
    const hasRankingSubscription = await this.twoTierSubscriptionService.hasActiveRankingSubscription(
      userId,
      residenceId,
      rankingCategoryId
    );

    if (!hasRankingSubscription) {
      return {
        canApply: false,
        reason: 'Active subscription for this ranking category required to apply',
        hasResidenceSubscription: true,
        hasRankingSubscription: false
      };
    }

    return {
      canApply: true,
      reason: 'You can apply for this ranking category',
      hasResidenceSubscription: true,
      hasRankingSubscription: true
    };
  }
} 
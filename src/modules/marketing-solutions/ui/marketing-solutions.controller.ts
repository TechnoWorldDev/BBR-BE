import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MarketingSolutionsService } from '../application/marketing-solutions.service';
import { MarketingLeadRequest } from './request/marketing-lead.request';
import { MarketingLeadResponse } from './response/marketing-lead.response';

@ApiTags('Marketing Solutions')
@Controller('marketing-solutions')
export class MarketingSolutionsController {
  constructor(private readonly marketingSolutionsService: MarketingSolutionsService) {}

  @Post('create-marketing')
  @ApiOperation({ 
    summary: 'Process marketing lead',
    description: 'Process a marketing lead by checking/creating user and residence. If user does not exist, creates user and sends password reset email. If residence does not exist, creates a basic residence.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Marketing lead processed successfully',
    type: MarketingLeadResponse
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid email address'
  })
  async processMarketingLead(
    @Body(new ValidationPipe()) request: MarketingLeadRequest
  ): Promise<MarketingLeadResponse> {
    const { user, residence } = await this.marketingSolutionsService.processMarketingLead({
      name: request.name,
      phoneNumber: request.phoneNumber,
      email: request.email,
      companyName: request.companyName,
      brandedResidenceName: request.brandedResidenceName,
      companyWebsite: request.companyWebsite,
    });

    const isNewUser = !user.password; // If no password, it's a new user
    const passwordResetEmailSent = isNewUser;
    const isNewResidence = !!residence;

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName || '',
        status: user.status || '',
        emailVerified: user.emailVerified || false,
      },
      residence: residence ? {
        id: residence.id,
        name: residence.name,
        slug: residence.slug,
        status: residence.status,
        developmentStatus: residence.developmentStatus,
      } : undefined,
      passwordResetEmailSent,
      isNewUser,
      isNewResidence,
    };
  }
} 
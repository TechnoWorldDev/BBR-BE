import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateResidenceVerificationCommandHandler } from '../application/handler/create-residence-verification.command.handler';
import { CreateResidenceVerificationRequest } from './request/create-residence-verification.request';
import { ResidenceVerificationResponse } from './response/residence-verification.response';
import { ResidenceVerificationMapper } from './mapper/residence-verification.mapper';
import { VerificationPricingService } from '../application/services/verification-pricing.service';

@ApiTags('Public Residence Verification')
@Controller('public/residence-verification')
export class ResidenceVerificationPublicController {
  constructor(
    private readonly createResidenceVerificationCommandHandler: CreateResidenceVerificationCommandHandler,
    private readonly residenceVerificationMapper: ResidenceVerificationMapper,
    private readonly verificationPricingService: VerificationPricingService
  ) {}

  @Get('pricing')
  @ApiOperation({
    summary: 'Get verification pricing',
    description: 'Get current pricing for all verification types',
  })
  @ApiResponse({
    status: 200,
    description: 'Pricing retrieved successfully',
  })
  async getPricing() {
    const pricingMap = await this.verificationPricingService.getAllPricing();

    return {
      success: true,
      data: pricingMap,
      message: 'Pricing retrieved successfully',
    };
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new residence verification request',
    description:
      'Create a new residence verification request for virtual or physical verification (public endpoint)',
  })
  @ApiResponse({
    status: 201,
    description: 'Residence verification request created successfully',
    type: ResidenceVerificationResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data',
  })
  async createResidenceVerification(
    @Body(new ValidationPipe()) request: CreateResidenceVerificationRequest
  ): Promise<ResidenceVerificationResponse> {
    const command = this.residenceVerificationMapper.toCreateCommand(request);
    const { verification } = await this.createResidenceVerificationCommandHandler.handle(command);

    return this.residenceVerificationMapper.toResponse(verification);
  }
}

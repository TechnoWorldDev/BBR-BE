import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateVisitBookingCommandHandler } from '../application/handler/create-visit-booking.command.handler';
import { CreateVisitBookingCommand } from '../application/command/create-visit-booking.command';
import { VisitBookingRequest } from './request/visit-booking-request';
import { VisitBookingResponse } from './response/visit-booking-response';

@ApiTags('Visit Booking')
@Controller('visit-booking')
export class VisitBookingController {
  constructor(private readonly createVisitBookingCommandHandler: CreateVisitBookingCommandHandler) {}

  @Post('process-visit')
  @ApiOperation({ 
    summary: 'Process site visit booking',
    description: 'Process a site visit booking by checking/creating user and residence. If user does not exist, creates user and sends password reset email. If residence does not exist, creates a basic residence. Creates visit booking with payment integration.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Site visit booking processed successfully',
    type: VisitBookingResponse
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid request data'
  })
  async processVisitBooking(
    @Body(new ValidationPipe()) request: VisitBookingRequest
  ): Promise<VisitBookingResponse> {
    const command = new CreateVisitBookingCommand(
      request.propertyName,
      request.countryId,
      request.cityId,
      request.address,
      request.planId,
      request.fullName,
      request.email,
      request.phone,
      request.password,
      request.stripePaymentMethodId,
      request.agree,
      request.propertyId,
      request.scheduledDate,
      request.scheduledTime,
      request.duration,
      request.specialRequirements,
      request.notes,
      request.numberOfVisitors,
    );

    const { user, residence, booking, checkoutSession, passwordResetEmailSent, isNewUser, isNewResidence } = 
      await this.createVisitBookingCommandHandler.handle(command);

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName || '',
        status: user.status || '',
        emailVerified: user.emailVerified || false,
      },
      booking: {
        id: booking.id,
        visitType: booking.visitType,
        status: booking.status,
        amount: booking.amount,
        currency: booking.currency,
        scheduledDate: booking.scheduledDate,
        scheduledTime: booking.scheduledTime,
        duration: booking.duration,
        specialRequirements: booking.specialRequirements,
        notes: booking.notes,
        numberOfVisitors: booking.numberOfVisitors,
        address: booking.address,
        platform: booking.platform,
      },
      checkoutSession: {
        id: checkoutSession.id,
        url: checkoutSession.url || '',
        paymentStatus: checkoutSession.payment_status,
      },
      passwordResetEmailSent,
      isNewUser,
      isNewResidence,
      residence: residence ? {
        id: residence.id,
        name: residence.name,
        slug: residence.slug,
        status: residence.status,
        developmentStatus: residence.developmentStatus,
      } : undefined,
    };
  }
}

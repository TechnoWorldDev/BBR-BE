import { Injectable } from '@nestjs/common';
import { ResidenceVerification } from '../../domain/residence-verification.entity';
import { ResidenceVerificationResponse } from '../response/residence-verification.response';
import { CreateResidenceVerificationRequest } from '../request/create-residence-verification.request';
import { CreateResidenceVerificationCommand } from '../../application/command/create-residence-verification.command';

@Injectable()
export class ResidenceVerificationMapper {
  toCreateCommand(request: CreateResidenceVerificationRequest): CreateResidenceVerificationCommand {
    return new CreateResidenceVerificationCommand(
      request.fullName,
      request.email,
      request.phone,
      request.password,
      request.verificationType,
      request.agree,
      request.propertyId,
      request.propertyName,
      request.address,
      request.cityId,
      request.countryId,
      request.planId,
      request.notes,
      request.meetingLink,
      request.platform,
      request.scheduledDate ? new Date(request.scheduledDate) : undefined,
      request.scheduledTime,
      request.preferredDate ? new Date(request.preferredDate) : undefined,
      request.preferredTime,
      request.numberOfVisitors,
      request.paymentMethodId,
      request.paymentIntentId,
    );
  }

  toResponse(verification: ResidenceVerification): ResidenceVerificationResponse {
    return {
      id: verification.id,
      userId: verification.userId,
      residenceId: verification.residenceId,
      verificationType: verification.verificationType,
      status: verification.status,
      price: verification.price,
      paymentStatus: verification.paymentStatus,
      notes: verification.notes,
      adminNotes: verification.adminNotes,
      meetingLink: verification.meetingLink,
      platform: verification.platform,
      scheduledDate: verification.scheduledDate,
      scheduledTime: verification.scheduledTime,
      preferredDate: verification.preferredDate,
      preferredTime: verification.preferredTime,
      numberOfVisitors: verification.numberOfVisitors,
      stripePaymentIntentId: verification.stripePaymentIntentId,
      stripeInvoiceId: verification.stripeInvoiceId,
      createdAt: verification.createdAt,
      updatedAt: verification.updatedAt,
      user: verification.user ? {
        id: verification.user.id,
        fullName: verification.user.fullName || '',
        email: verification.user.email,
      } : undefined,
      residence: verification.residence ? {
        id: verification.residence.id,
        name: verification.residence.name,
        slug: verification.residence.slug,
      } : undefined,
    };
  }
}

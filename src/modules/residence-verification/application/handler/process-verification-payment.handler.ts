import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { IResidenceVerificationRepository } from '../../domain/residence-verification.repository.interface';
import { ResidenceVerification } from '../../domain/residence-verification.entity';
import { PaymentStatusEnum } from '../../domain/payment-status.enum';
import { VerificationStatusEnum } from '../../domain/verification-status.enum';
import Stripe from 'stripe';

@Injectable()
export class ProcessVerificationPaymentHandler {
  constructor(
    @Inject('IResidenceVerificationRepository')
    private readonly residenceVerificationRepository: IResidenceVerificationRepository,
  ) {}

  async handle(paymentIntent: Stripe.PaymentIntent): Promise<ResidenceVerification> {
    // Try to find verification by payment intent ID first
    let verification = await this.residenceVerificationRepository.findByStripePaymentIntentId(paymentIntent.id);
    
    // If not found by payment intent ID, try metadata (for backward compatibility)
    if (!verification && paymentIntent.metadata?.verificationId) {
      verification = await this.residenceVerificationRepository.findById(paymentIntent.metadata.verificationId);
    }
    
    if (!verification) {
      console.error('Residence verification not found for payment intent:', paymentIntent.id);
      throw new NotFoundException('Residence verification not found for this payment');
    }

    console.log(`Processing payment for verification: ${verification.id}, status: ${paymentIntent.status}`);

    // Determine payment status based on payment intent status
    const isPaymentSuccessful = paymentIntent.status === 'succeeded';
    const paymentStatus = isPaymentSuccessful ? PaymentStatusEnum.PAID : PaymentStatusEnum.FAILED;
    
    // Update verification status based on payment result
    const verificationStatus = isPaymentSuccessful ? VerificationStatusEnum.APPROVED : VerificationStatusEnum.REJECTED;

    // Update verification with payment information
    const updateData: Partial<ResidenceVerification> = {
      stripePaymentIntentId: paymentIntent.id,
      paymentStatus,
      status: verificationStatus,
    };

    // Try to get invoice ID if available
    if (paymentIntent.latest_charge) {
      try {
        // Note: In a real implementation, you might want to fetch the charge details
        // to get the invoice ID, but for now we'll skip it since PaymentIntent
        // doesn't directly expose the invoice
        console.log('Payment charge ID:', paymentIntent.latest_charge);
      } catch (error) {
        console.error('Error fetching charge details:', error);
      }
    }

    console.log(`Updating verification ${verification.id} with payment status: ${paymentStatus}, verification status: ${verificationStatus}`);

    const updatedVerification = await this.residenceVerificationRepository.update(verification.id, updateData);
    
    if (!updatedVerification) {
      throw new NotFoundException('Failed to update verification');
    }

    console.log(`Successfully updated verification ${verification.id}`);
    return updatedVerification;
  }
}

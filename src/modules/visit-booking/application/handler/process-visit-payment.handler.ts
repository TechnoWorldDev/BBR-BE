import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { IVisitBookingRepository } from '../../domain/visit-booking.repository.interface';
import { VisitStatusEnum } from '../../domain/visit-status.enum';
import { EmailQueue } from '../../../email/infrastructure/queues/email.queue';
import { EmailAction } from '../../../email/domain/email-action.enum';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class ProcessVisitPaymentHandler {
  constructor(
    private readonly visitBookingRepository: IVisitBookingRepository,
    private readonly emailQueue: EmailQueue,
    private readonly configService: ConfigService
  ) {}

  async handle(session: Stripe.Checkout.Session): Promise<void> {
    const bookingId = session.metadata?.bookingId;
    const userId = session.metadata?.userId;
    const visitType = session.metadata?.visitType;
    const residenceId = session.metadata?.residenceId;

    if (!bookingId || !userId || !visitType || !residenceId) {
      throw new InternalServerErrorException('Missing required metadata in session');
    }

    // Find the booking
    const booking = await this.visitBookingRepository.findById(bookingId);
    if (!booking) {
      throw new NotFoundException('Visit booking not found');
    }

    // Update booking with payment information
    const updatedBooking = await this.visitBookingRepository.update(bookingId, {
      status: VisitStatusEnum.PAID,
      stripePaymentIntentId: session.payment_intent as string,
      stripeInvoiceId: session.invoice as string,
      paymentStatus: 'succeeded'
    });

    if (!updatedBooking) {
      throw new InternalServerErrorException('Failed to update booking payment status');
    }

    // Send confirmation email
    await this.sendConfirmationEmail(updatedBooking);
  }

  private async sendConfirmationEmail(booking: any): Promise<void> {
    const emailAction = booking.visitType === 'SITE_VISIT' 
      ? EmailAction.CONTACT_CONSULTATION 
      : EmailAction.REQUEST_INFORMATION;

    await this.emailQueue.addEmailJob(emailAction, {
      to: booking.contactEmail,
      variables: {
        fullName: booking.contactName,
        visitType: booking.visitType,
        amount: booking.amount,
        currency: booking.currency,
        bookingId: booking.id,
        scheduledDate: booking.scheduledDate,
        scheduledTime: booking.scheduledTime,
        exploreMoreResidencesLink: `${this.configService.get<string>('FRONTEND_URL')}/residences`,
      },
    });
  }
}

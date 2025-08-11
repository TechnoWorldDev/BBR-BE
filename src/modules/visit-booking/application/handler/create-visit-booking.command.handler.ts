import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateVisitBookingCommand } from '../command/create-visit-booking.command';
import { IVisitBookingRepository } from '../../domain/visit-booking.repository.interface';
import { VisitBooking } from '../../domain/visit-booking.entity';
import { VisitStatusEnum } from '../../domain/visit-status.enum';
import { VisitTypeEnum } from '../../domain/visit-type.enum';
import { IUserRepository } from '../../../user/domain/user.repository.interface';
import { IResidenceRepository } from '../../../residentmanagement/residence/domain/residence.repository.interface';
import { IRoleRepository } from '../../../role/domain/role.repository.interface';
import { ICompanyRepository } from '../../../company/domain/company.repository.interface';
import { StripeService } from '../../../../shared/stripe/stripe.service';
import { StripeCustomerService } from '../../../billing/application/services/stripe-customer.service';
import { RequestPasswordCommandHandler } from '../../../auth/application/handlers/request-password.command.handler';
import { User } from '../../../user/domain/user.entity';
import { Residence } from '../../../residentmanagement/residence/domain/residence.entity';
import { UserStatusEnum } from '../../../../shared/types/user-status.enum';
import { SignupMethodEnum } from '../../../../shared/types/signup-method.enum';
import { ResidenceStatusEnum } from '../../../residentmanagement/residence/domain/residence-status.enum';
import { DevelopmentStatusEnum } from '../../../../shared/types/development-status.enum';
import { RequestResetPasswordCommand } from '../../../auth/application/commands/request-reset-password.command';
import { PasswordEncoder } from '../../../../shared/passwordEncoder/password-encoder.util';
import Stripe from 'stripe';

@Injectable()
export class CreateVisitBookingCommandHandler {
  constructor(
    private readonly visitBookingRepository: IVisitBookingRepository,
    private readonly userRepository: IUserRepository,
    private readonly residenceRepository: IResidenceRepository,
    private readonly roleRepository: IRoleRepository,
    private readonly companyRepository: ICompanyRepository,
    private readonly stripeService: StripeService,
    private readonly stripeCustomerService: StripeCustomerService,
    private readonly requestPasswordCommandHandler: RequestPasswordCommandHandler,
    private readonly configService: ConfigService
  ) {}

  async handle(command: CreateVisitBookingCommand): Promise<{ 
    user: User; 
    residence?: Residence; 
    booking: VisitBooking;
    checkoutSession: Stripe.Checkout.Session;
    passwordResetEmailSent: boolean;
    isNewUser: boolean;
    isNewResidence: boolean;
  }> {
    if (!command.agree) {
      throw new BadRequestException('You must agree to the terms to proceed.');
    }

    // Check if user exists
    let user = await this.userRepository.findByEmail(command.email);

    if (!user) {
      // Create new user with password
      const buyerRole = await this.roleRepository.findByName('buyer');
      if (!buyerRole) {
        throw new BadRequestException('Buyer role not found');
      }

      const hashedPassword = await PasswordEncoder.hash(command.password);

      const newUser: Partial<User> = {
        email: command.email,
        fullName: command.fullName,
        password: hashedPassword,
        signupMethod: SignupMethodEnum.EMAIL,
        status: UserStatusEnum.ACTIVE,
        roleId: buyerRole.id,
        emailVerified: false,
        agreedTerms: true,
        receiveLuxuryInsights: false,
        notifyLatestNews: false,
        notifyMarketTrends: false,
        notifyBlogs: false,
        pushNotifications: false,
        emailNotifications: true,
      };

      const createdUser = await this.userRepository.create(newUser);
      if (!createdUser) {
        throw new InternalServerErrorException('Failed to create user');
      }
      user = createdUser;
    }

    if (!user) {
      throw new InternalServerErrorException('Failed to create or find user');
    }

    // Check if residence exists or create new one
    let residence: Residence | undefined;

    if (command.propertyId) {
      residence = await this.residenceRepository.findById(command.propertyId);
      if (!residence) {
        throw new BadRequestException('Property not found');
      }
    } else {
      // Create new residence
      const newResidence: Partial<Residence> = {
        name: command.propertyName,
        slug: command.propertyName.toLowerCase().replace(/\s+/g, '-'),
        status: ResidenceStatusEnum.ACTIVE,
        developmentStatus: DevelopmentStatusEnum.PLANNED,
        subtitle: 'Your branded residence',
        description: 'A premium branded residence for affluent buyers',
        budgetStartRange: 500000,
        budgetEndRange: 2000000,
        address: command.address,
        longitude: '0.0',
        latitude: '0.0',
        yearBuilt: new Date().getFullYear().toString(),
        floorSqft: 0,
        staffRatio: 0,
        petFriendly: true,
        disabledFriendly: true,
        countryId: command.countryId,
        cityId: command.cityId,
        developerId: user.id,
      };

      residence = await this.residenceRepository.create(newResidence);
      if (!residence) {
        throw new InternalServerErrorException('Failed to create residence');
      }
    }

    // Create visit booking with pending payment status
    const bookingData: Partial<VisitBooking> = {
      userId: user.id,
      residenceId: residence.id,
      visitType: VisitTypeEnum.SITE_VISIT, // Always site visit
      status: VisitStatusEnum.PENDING_PAYMENT,
      contactName: command.fullName,
      contactEmail: command.email,
      contactPhone: command.phone,
      scheduledDate: command.scheduledDate ? new Date(command.scheduledDate) : undefined,
      scheduledTime: command.scheduledTime,
      duration: command.duration,
      specialRequirements: command.specialRequirements,
      notes: command.notes,
      numberOfVisitors: command.numberOfVisitors,
      address: command.address,
      amount: 1500, // Site visit pricing
      currency: 'USD',
      paymentStatus: 'pending'
    };

    const booking = await this.visitBookingRepository.create(bookingData);
    if (!booking) {
      throw new InternalServerErrorException('Failed to create visit booking');
    }

    // Create Stripe checkout session for ONE-TIME payment
    const customerId = await this.stripeCustomerService.getOrCreateCustomer(user.id, command.email);
    if (!customerId) {
      throw new InternalServerErrorException('Customer not found');
    }

    // Get the site visit price ID for one-time payment
    const priceId = this.configService.get<string>('STRIPE_SITE_VISIT_PRICE_ID') || 'price_site_visit';
    
    const checkoutSession = await this.stripeService.createCheckoutSession({
      mode: 'payment', // ONE-TIME payment, not subscription
      success_url: `${this.configService.get<string>('FRONTEND_URL')}/visit-booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${this.configService.get<string>('FRONTEND_URL')}/visit-booking/cancel`,
      customer: customerId,
      payment_method_types: ['card'],
      metadata: {
        userId: user.id,
        bookingId: booking.id,
        visitType: VisitTypeEnum.SITE_VISIT,
        residenceId: residence.id,
        paymentMethodId: command.stripePaymentMethodId, // Store payment method ID in metadata
      },
      line_items: [{ price: priceId, quantity: 1 }],
    });

    if (!checkoutSession) {
      throw new InternalServerErrorException('Failed to create checkout session');
    }

    const isNewUser = !user.password; // If no password, it's a new user
    const passwordResetEmailSent = isNewUser;
    const isNewResidence = !!residence;

    return { 
      user, 
      residence, 
      booking, 
      checkoutSession,
      passwordResetEmailSent,
      isNewUser,
      isNewResidence
    };
  }
}

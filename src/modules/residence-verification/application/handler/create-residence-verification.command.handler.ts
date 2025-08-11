import { Injectable, BadRequestException, InternalServerErrorException, Inject } from '@nestjs/common';
import { CreateResidenceVerificationCommand } from '../command/create-residence-verification.command';
import { IResidenceVerificationRepository } from '../../domain/residence-verification.repository.interface';
import { ResidenceVerification } from '../../domain/residence-verification.entity';
import { VerificationStatusEnum } from '../../domain/verification-status.enum';
import { PaymentStatusEnum } from '../../domain/payment-status.enum';
import { IUserRepository } from '../../../user/domain/user.repository.interface';
import { IResidenceRepository } from '../../../residentmanagement/residence/domain/residence.repository.interface';
import { IRoleRepository } from '../../../role/domain/role.repository.interface';
import { User } from '../../../user/domain/user.entity';
import { Residence } from '../../../residentmanagement/residence/domain/residence.entity';
import { UserStatusEnum } from '../../../../shared/types/user-status.enum';
import { SignupMethodEnum } from '../../../../shared/types/signup-method.enum';
import { ResidenceStatusEnum } from '../../../residentmanagement/residence/domain/residence-status.enum';
import { DevelopmentStatusEnum } from '../../../../shared/types/development-status.enum';
import { VerificationPricingService } from '../services/verification-pricing.service';
import { PasswordEncoder } from '../../../../shared/passwordEncoder/password-encoder.util';
import { StripeService } from '../../../../shared/stripe/stripe.service';

@Injectable()
export class CreateResidenceVerificationCommandHandler {
  constructor(
    @Inject('IResidenceVerificationRepository')
    private readonly residenceVerificationRepository: IResidenceVerificationRepository,
    private readonly userRepository: IUserRepository,
    private readonly residenceRepository: IResidenceRepository,
    private readonly roleRepository: IRoleRepository,
    private readonly verificationPricingService: VerificationPricingService,
    private readonly stripeService: StripeService,
  ) {}

  async handle(command: CreateResidenceVerificationCommand): Promise<{ 
    user: User; 
    residence?: Residence; 
    verification: ResidenceVerification;
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
      const developerRole = await this.roleRepository.findByName('developer');
      if (!developerRole) {
        throw new BadRequestException('Developer role not found');
      }

      const hashedPassword = await PasswordEncoder.hash(command.password);

      const newUser: Partial<User> = {
        email: command.email,
        fullName: command.fullName,
        password: hashedPassword,
        signupMethod: SignupMethodEnum.EMAIL,
        status: UserStatusEnum.ACTIVE,
        roleId: developerRole.id,
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
    } else if (command.propertyName) {
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

    // Get pricing for verification type from database
    const pricing = await this.verificationPricingService.getPricing(command.verificationType);

    // Check payment intent status if provided
    let paymentStatus = PaymentStatusEnum.UNPAID;
    let verificationStatus = VerificationStatusEnum.PENDING;
    
    if (command.paymentIntentId) {
      try {
        // Retrieve payment intent from Stripe to check its status
        const paymentIntent = await this.stripeService.retrievePaymentIntent(command.paymentIntentId);
        
        if (paymentIntent.status === 'succeeded') {
          paymentStatus = PaymentStatusEnum.PAID;
          verificationStatus = VerificationStatusEnum.APPROVED;
        } else if (paymentIntent.status === 'requires_payment_method' || paymentIntent.status === 'requires_confirmation') {
          paymentStatus = PaymentStatusEnum.UNPAID;
          verificationStatus = VerificationStatusEnum.PENDING;
        } else if (paymentIntent.status === 'canceled') {
          paymentStatus = PaymentStatusEnum.FAILED;
          verificationStatus = VerificationStatusEnum.REJECTED;
        } else {
          // For other statuses like 'processing', 'requires_action', etc.
          paymentStatus = PaymentStatusEnum.UNPAID;
          verificationStatus = VerificationStatusEnum.PENDING;
        }
      } catch (error) {
        console.error('Error retrieving payment intent:', error);
        // If we can't retrieve the payment intent, default to unpaid
        paymentStatus = PaymentStatusEnum.UNPAID;
        verificationStatus = VerificationStatusEnum.PENDING;
      }
    }
    
    const verificationData: Partial<ResidenceVerification> = {
      userId: user.id,
      residenceId: residence?.id,
      verificationType: command.verificationType,
      status: verificationStatus,
      price: pricing.price,
      paymentStatus: paymentStatus,
      stripePaymentIntentId: command.paymentIntentId,
      notes: command.notes,
      meetingLink: command.meetingLink,
      platform: command.platform,
      scheduledDate: command.scheduledDate,
      scheduledTime: command.scheduledTime,
      preferredDate: command.preferredDate,
      preferredTime: command.preferredTime,
      numberOfVisitors: command.numberOfVisitors,
    };

    const verification = await this.residenceVerificationRepository.create(verificationData);
    if (!verification) {
      throw new InternalServerErrorException('Failed to create residence verification');
    }

    const isNewUser = !user.password; // If no password, it's a new user
    const passwordResetEmailSent = isNewUser;
    const isNewResidence = !!residence;

    return { 
      user, 
      residence, 
      verification,
      passwordResetEmailSent,
      isNewUser,
      isNewResidence
    };
  }
}

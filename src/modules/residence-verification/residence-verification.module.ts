import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../shared/infrastructure/database/database.module';
import { ResidenceVerificationPublicController } from './ui/residence-verification.public.controller';
import { ResidenceVerificationRepository } from './infrastructure/residence-verification.repository';
import { IResidenceVerificationRepository } from './domain/residence-verification.repository.interface';
import { CreateResidenceVerificationCommandHandler } from './application/handler/create-residence-verification.command.handler';
import { ProcessVerificationPaymentHandler } from './application/handler/process-verification-payment.handler';
import { ResidenceVerificationMapper } from './ui/mapper/residence-verification.mapper';
import { IUserRepository } from '../user/domain/user.repository.interface';
import { UserRepositoryImpl } from '../user/infrastructure/user.repository';
import { IResidenceRepository } from '../residentmanagement/residence/domain/residence.repository.interface';
import { ResidenceRepository } from '../residentmanagement/residence/infrastructure/residence.repository';
import { IRoleRepository } from '../role/domain/role.repository.interface';
import { RoleRepositoryImpl } from '../role/infrastructure/role.repository';
import { VerificationPricingService } from './application/services/verification-pricing.service';
import { IVerificationPricingRepository } from './domain/verification-pricing.repository.interface';
import { VerificationPricingRepository } from './infrastructure/verification-pricing.repository';
import EmailModule from '../email/email.module';
import { StripeModule } from 'src/shared/stripe/stripe.module';

@Module({
  imports: [DatabaseModule, EmailModule, StripeModule],
  controllers: [ResidenceVerificationPublicController],
  providers: [
    {
      provide: 'IResidenceVerificationRepository',
      useClass: ResidenceVerificationRepository,
    },
    {
      provide: 'IVerificationPricingRepository',
      useClass: VerificationPricingRepository,
    },
    {
      provide: IUserRepository,
      useClass: UserRepositoryImpl,
    },
    {
      provide: IResidenceRepository,
      useClass: ResidenceRepository,
    },
    {
      provide: IRoleRepository,
      useClass: RoleRepositoryImpl,
    },
    CreateResidenceVerificationCommandHandler,
    ProcessVerificationPaymentHandler,
    ResidenceVerificationMapper,
    VerificationPricingService,
  ],
  exports: ['IResidenceVerificationRepository', ProcessVerificationPaymentHandler],
})
export class ResidenceVerificationModule {}

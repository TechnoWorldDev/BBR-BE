import { Module } from '@nestjs/common';
import { VisitBookingController } from './ui/visit-booking.controller';
import { VisitBookingRepository } from './infrastructure/visit-booking.repository';
import { IVisitBookingRepository } from './domain/visit-booking.repository.interface';
import { CreateVisitBookingCommandHandler } from './application/handler/create-visit-booking.command.handler';
import { ProcessVisitPaymentHandler } from './application/handler/process-visit-payment.handler';
import { StripeService } from '../../shared/stripe/stripe.service';
import { StripeCustomerService } from '../billing/application/services/stripe-customer.service';
import { RequestPasswordCommandHandler } from '../auth/application/handlers/request-password.command.handler';
import { IUserRepository } from '../user/domain/user.repository.interface';
import { UserRepositoryImpl } from '../user/infrastructure/user.repository';
import { IRoleRepository } from '../role/domain/role.repository.interface';
import { RoleRepositoryImpl } from '../role/infrastructure/role.repository';
import { ICompanyRepository } from '../company/domain/company.repository.interface';
import { CompanyRepository } from '../company/infrastructure/company.repository';
import { IStripeCustomerRepository } from '../billing/domain/interfaces/stripe-customer.repository.interface';
import { StripeCustomerRepositoryImpl } from '../billing/infrastructure/stripe-customer.repository';
import { IEmailRepository } from '../email/domain/email.repository.interface';
import { EmailRepository } from '../email/infrastructure/email.repository';
import { IAuthRepository } from '../auth/domain/auth.repository.interface';
import { AuthRepository } from '../auth/infrastructure/auth.repository';
import { IPasswordResetRequestRepository } from '../auth/domain/password-reset-request.repository.interface';
import { passwordResetRequestRepository } from '../auth/infrastructure/password-reset-request.repository';
import { SendResetPasswordEmailCommandHandler } from '../email/application/send-reset-password-email.command.handler';
import { DatabaseModule } from '../../shared/infrastructure/database/database.module';
import EmailModule from '../email/email.module';
import { IResidenceRepository } from '../residentmanagement/residence/domain/residence.repository.interface';
import { ResidenceRepository } from '../residentmanagement/residence/infrastructure/residence.repository';

@Module({
  imports: [DatabaseModule, EmailModule],
  controllers: [VisitBookingController],
  providers: [
    {
      provide: IVisitBookingRepository,
      useClass: VisitBookingRepository,
    },
    {
      provide: IUserRepository,
      useClass: UserRepositoryImpl,
    },
    {
      provide: IRoleRepository,
      useClass: RoleRepositoryImpl,
    },
    {
      provide: ICompanyRepository,
      useClass: CompanyRepository,
    },
    {
      provide: IResidenceRepository,
      useClass: ResidenceRepository,
    },
    {
      provide: IStripeCustomerRepository,
      useClass: StripeCustomerRepositoryImpl,
    },
    {
      provide: IEmailRepository,
      useClass: EmailRepository,
    },
    {
      provide: IAuthRepository,
      useClass: AuthRepository,
    },
    {
      provide: IPasswordResetRequestRepository,
      useClass: passwordResetRequestRepository,
    },
    CreateVisitBookingCommandHandler,
    ProcessVisitPaymentHandler,
    StripeService,
    StripeCustomerService,
    RequestPasswordCommandHandler,
    SendResetPasswordEmailCommandHandler,
  ],
  exports: [
    IVisitBookingRepository,
    ProcessVisitPaymentHandler,
  ],
})
export class VisitBookingModule {}

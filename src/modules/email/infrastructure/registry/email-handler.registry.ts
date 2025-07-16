import { Injectable } from '@nestjs/common';
import { SendEmailCommand } from '../../application/command/send-email.command';
import { SendInviteEmailCommand } from '../../application/command/send-invite-email.command';
import { SendOnFormSubmitCommand } from '../../application/command/send-on-form-submit.command';
import { SendResetPasswordEmailCommand } from '../../application/command/send-reset-password-email.command';
import { SendVerifyEmailCommand } from '../../application/command/send-verify-email.command';
import { SendWelcomeEmailCommand } from '../../application/command/send-welcome.command';
import { SendInviteEmailCommandHandler } from '../../application/send-invite-email.command.handler';
import { SendOnFormSubmitCommandHandler } from '../../application/send-on-form-submit.command.handler';
import { SendResetPasswordEmailCommandHandler } from '../../application/send-reset-password-email.command.handler';
import { SendVerifyEmailCommandHandler } from '../../application/send-verify-email.command.handler';
import { SendWelcomeEmailCommandHandler } from '../../application/send-welcome-email.command.handler';
import { EmailAction } from '../../domain/email-action.enum';
import { SendContactConsultationEmailCommandHandler } from '../../application/send-contact-consultation.handler';
import { SendContactConsultationEmailCommand } from '../../application/command/send-contact-consultation';
import { SendRequestInformationEmailCommandHandler } from '../../application/send-request-information.handler';
import { SendRequestInformationCommand } from '../../application/command/send-request-information';
import { SendSubmitReviewCommandHandler } from '../../application/send-submit-review.handler';
import { SendSubmitReviewCommand } from '../../application/command/send-submit-review';
import { SendReportAnErrorCommand } from '../../application/command/send-report-an-error.command';
import { SendReportAnErrorCommandHandler } from '../../application/send-report-an-error.command.handler';
import { SendApplyForRankingCommandHandler } from '../../application/send-apply-for-ranking.command.handler';
import { SendApplyForRankingCommand } from '../../application/command/send-apply-for-ranking.command';
import { SendRegisterResidenceCommandHandler } from '../../application/send-register-residence.command.handler';
import { SendRegisterResidenceCommand } from '../../application/command/send-register-residence.command';
import { SendJobApplicationCommandHandler } from '../../application/send-job-application.command.handler';
import { SendJobApplicationCommand } from '../../application/command/send-job-application.command';
import { SendAcceptedResidenceCommandHandler } from '../../application/send-accepted-residence.command.handler';
import { SendAcceptedResidenceCommand } from '../../application/command/send-accepted-residence.command';
import { SendRejectedResidenceCommand } from '../../application/command/send-rejected-residence.command';
import { SendRejectedResidenceCommandHandler } from '../../application/send-rejected-residence.command.handler';
import { SendOwnershipRequestCommandHandler } from '../../application/send-ownership-request.command.handler';
import { SendOwnershipRequestAcceptedCommandHandler } from '../../application/send-ownership-request-accepted.command.handler';
import { SendOwnershipRequestDeclinedCommandHandler } from '../../application/send-ownership-request-declined.command.handler';
import { SendOwnershipRequestCommand } from '../../application/command/send-ownership-request.command';
import { SendOwnershipRequestAcceptedCommand } from '../../application/command/send-ownership-request-accepted.command';
import { SendOwnershipRequestDeclinedCommand } from '../../application/command/send-ownership-request-declined.command';
import { SendRegisterUnitCommand } from '../../application/command/send-register-unit.command';
import { SendRegisterUnitCommandHandler } from '../../application/send-register-unit.command.handler';
import { SendPremiumSubscriptionCommandHandler } from '../../application/send-premium-subscription.command.handler';
import { SendPremiumSubscriptionCommand } from '../../application/command/send-premium-subscription.command';
import { SendSuggestFeatureCommand } from '../../application/command/send-suggest-feature.command';
import { SendSuggestFeatureCommandHandler } from '../../application/send-suggest-feature.command.handler';
import { SendContactUsEmailCommand } from '../../application/command/send-contact-us.command';
import { SendContactUsEmailCommandHandler } from '../../application/send-contact-us.command.handler';
import { SendB2BFormCommandHandler } from '../../application/send-b2b-form.command.handler';
import { SendB2BFormCommand } from '../../application/command/send-b2b-form';

@Injectable()
export class EmailHandlerRegistry {
  constructor(
    private readonly invite: SendInviteEmailCommandHandler,
    private readonly reset: SendResetPasswordEmailCommandHandler,
    private readonly verify: SendVerifyEmailCommandHandler,
    private readonly welcome: SendWelcomeEmailCommandHandler,
    private readonly onForm: SendOnFormSubmitCommandHandler,
    private readonly contactConsultation: SendContactConsultationEmailCommandHandler,
    private readonly requestInformation: SendRequestInformationEmailCommandHandler,
    private readonly submitReview: SendSubmitReviewCommandHandler,
    private readonly reportAnError: SendReportAnErrorCommandHandler,
    private readonly applyForRanking: SendApplyForRankingCommandHandler,
    private readonly registerResidence: SendRegisterResidenceCommandHandler,
    private readonly jobApplication: SendJobApplicationCommandHandler,
    private readonly acceptedResidence: SendAcceptedResidenceCommandHandler,
    private readonly rejectedResidence: SendRejectedResidenceCommandHandler,
    private readonly ownershipRequest: SendOwnershipRequestCommandHandler,
    private readonly ownershipRequestAccepted: SendOwnershipRequestAcceptedCommandHandler,
    private readonly ownershipRequestDeclined: SendOwnershipRequestDeclinedCommandHandler,
    private readonly registerUnit: SendRegisterUnitCommandHandler,
    private readonly premiumSubscription: SendPremiumSubscriptionCommandHandler,
    private readonly suggestFeature: SendSuggestFeatureCommandHandler,
    private readonly contactUs: SendContactUsEmailCommandHandler,
    private readonly b2bForm: SendB2BFormCommandHandler
  ) {}

  getHandler(action: EmailAction): (cmd: SendEmailCommand) => Promise<void> {
    const map: Record<EmailAction, (cmd: SendEmailCommand) => Promise<void>> = {
      [EmailAction.WELCOME]: (cmd) =>
        this.welcome.handle(
          new SendWelcomeEmailCommand(cmd.to, cmd.variables.fullName, cmd.variables.verifyEmailUrl)
        ),

      [EmailAction.RESET_PASSWORD]: (cmd) =>
        this.reset.handle(new SendResetPasswordEmailCommand(cmd.to, cmd.variables.otp)),

      [EmailAction.VERIFY_EMAIL]: (cmd) =>
        this.verify.handle(new SendVerifyEmailCommand(cmd.to, cmd.variables.verificationLink)),

      [EmailAction.INVITE]: (cmd) =>
        this.invite.handle(
          new SendInviteEmailCommand(cmd.to, cmd.variables.inviteLink, cmd.variables.tempPassword)
        ),

      [EmailAction.ON_FORM_SUBMIT]: (cmd) =>
        this.onForm.handle(new SendOnFormSubmitCommand(cmd.to, cmd.variables.fullName)),

      [EmailAction.CONTACT_CONSULTATION]: (cmd) =>
        this.contactConsultation.handle(
          new SendContactConsultationEmailCommand(
            cmd.to,
            cmd.variables.fullName,
            cmd.variables.exploreMoreResidencesLink
          )
        ),

      [EmailAction.REQUEST_INFORMATION]: (cmd) =>
        this.requestInformation.handle(
          new SendRequestInformationCommand(
            cmd.to,
            cmd.variables.fullName,
            cmd.variables.residenceName,
            cmd.variables.exploreMoreResidencesLink
          )
        ),

      [EmailAction.CONTACT_US]: (cmd) =>
        this.contactUs.handle(
          new SendContactUsEmailCommand(
            cmd.to,
            cmd.variables.fullName,
            cmd.variables.exploreMoreResidencesLink
          )
        ),

      [EmailAction.B2B_FORM]: (cmd) =>
        this.b2bForm.handle(
          new SendB2BFormCommand(
            cmd.to,
            cmd.variables.fullName,
            cmd.variables.residenceName,
            cmd.variables.companyName,
            cmd.variables.exploreMoreResidencesLink
          )
        ),

      [EmailAction.SUGGEST_FEATURE]: (cmd) =>
        this.suggestFeature.handle(
          new SendSuggestFeatureCommand(
            cmd.to,
            cmd.variables.fullName,
            cmd.variables.exploreMoreResidencesLink
          )
        ),

      [EmailAction.SUBMIT_REVIEW]: (cmd) =>
        this.submitReview.handle(
          new SendSubmitReviewCommand(
            cmd.to,
            cmd.variables.fullName,
            cmd.variables.residenceName,
            cmd.variables.exploreMoreResidencesLink
          )
        ),

      [EmailAction.REPORT_AN_ERROR]: (cmd) =>
        this.reportAnError.handle(
          new SendReportAnErrorCommand(
            cmd.to,
            cmd.variables.fullName,
            cmd.variables.exploreMoreResidencesLink
          )
        ),

      [EmailAction.APPLY_FOR_RANKING]: (cmd) =>
        this.applyForRanking.handle(
          new SendApplyForRankingCommand(
            cmd.to,
            cmd.variables.fullName,
            cmd.variables.residenceName,
            cmd.variables.categoryName,
            cmd.variables.exploreMoreResidencesLink
          )
        ),

      // TODO
      [EmailAction.REQUEST_PREMIUM_PROFILE]: (cmd) => Promise.resolve(),

      [EmailAction.PREMIUM_SUBSCRIPTION]: (cmd) =>
        this.premiumSubscription.handle(
          new SendPremiumSubscriptionCommand(
            cmd.to,
            cmd.variables.fullName,
            cmd.variables.manageResidencesLink
          )
        ),
      [EmailAction.REGISTER_RESIDENCE]: (cmd) =>
        this.registerResidence.handle(
          new SendRegisterResidenceCommand(
            cmd.to,
            cmd.variables.fullName,
            cmd.variables.residenceName,
            cmd.variables.manageResidencesLink
          )
        ),

      [EmailAction.REGISTER_UNIT]: (cmd) =>
        this.registerUnit.handle(
          new SendRegisterUnitCommand(
            cmd.to,
            cmd.variables.fullName,
            cmd.variables.unitName,
            cmd.variables.manageResidencesLink
          )
        ),

      [EmailAction.JOB_APPLICATION]: (cmd) =>
        this.jobApplication.handle(
          new SendJobApplicationCommand(
            cmd.to,
            cmd.variables.fullName,
            cmd.variables.exploreMoreOpportunitiesLink
          )
        ),

      [EmailAction.ACCEPTED_RESIDENCE]: (cmd) =>
        this.acceptedResidence.handle(
          new SendAcceptedResidenceCommand(
            cmd.to,
            cmd.variables.fullName,
            cmd.variables.residenceName,
            cmd.variables.manageResidencesLink
          )
        ),

      [EmailAction.REJECTED_RESIDENCE]: (cmd) =>
        this.rejectedResidence.handle(
          new SendRejectedResidenceCommand(
            cmd.to,
            cmd.variables.fullName,
            cmd.variables.residenceName,
            cmd.variables.manageResidencesLink
          )
        ),

      [EmailAction.OWNERSHIP_REQUEST]: (cmd) =>
        this.ownershipRequest.handle(
          new SendOwnershipRequestCommand(
            cmd.to,
            cmd.variables.fullName,
            cmd.variables.residenceName,
            cmd.variables.manageResidencesLink
          )
        ),

      [EmailAction.OWNERSHIP_REQUEST_ACCEPTED]: (cmd) =>
        this.ownershipRequestAccepted.handle(
          new SendOwnershipRequestAcceptedCommand(
            cmd.to,
            cmd.variables.fullName,
            cmd.variables.residenceName,
            cmd.variables.manageResidencesLink
          )
        ),

      [EmailAction.OWNERSHIP_REQUEST_DECLINED]: (cmd) =>
        this.ownershipRequestDeclined.handle(
          new SendOwnershipRequestDeclinedCommand(
            cmd.to,
            cmd.variables.fullName,
            cmd.variables.residenceName,
            cmd.variables.manageResidencesLink
          )
        ),
    };

    if (!map[action]) throw new Error(`No email handler for action: ${action}`);
    return map[action];
  }
}

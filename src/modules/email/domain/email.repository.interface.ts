export abstract class IEmailRepository {
  abstract sendEmail(
    to: string,
    subject: string,
    template: string,
    variables?: Record<string, any>
  ): Promise<any>;

  abstract sendInvoice(to: string, subject: string, pdf: string, html: string): Promise<any>;
}

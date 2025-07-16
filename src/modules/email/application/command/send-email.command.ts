export class SendEmailCommand {
  constructor(
    public readonly to: string,
    public readonly subject: string,
    public readonly template: string,
    public readonly variables: Record<string, any>
  ) {}
}


export class RequestResponse {
  constructor(
    public readonly id: string,
    public readonly message: string,
    public readonly subject: string | null,
    public readonly status: string,
    public readonly entityId: string,
    public readonly type: string,
  ) {}
}

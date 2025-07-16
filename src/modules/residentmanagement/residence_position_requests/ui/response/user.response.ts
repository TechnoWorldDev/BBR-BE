import { CompanyResponse } from './company.response';

export class UserResponse {
  constructor(
    public readonly id: string,
    public readonly fullName: string,
    public readonly email: string,
    public readonly company: CompanyResponse
  ) {}
}

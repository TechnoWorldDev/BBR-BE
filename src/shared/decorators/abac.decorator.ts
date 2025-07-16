import { SetMetadata } from '@nestjs/common';

export const ABAC_KEY = 'abac';
export const ABAC = (condition: (user: any, req: any) => boolean) =>
  SetMetadata(ABAC_KEY, condition);

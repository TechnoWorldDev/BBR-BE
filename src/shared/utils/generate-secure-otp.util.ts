import { randomInt } from 'crypto';

export function generateSecureOtp(length = 6): string {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return randomInt(min, max + 1).toString();
}

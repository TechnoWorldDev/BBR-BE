import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class GenerateCheckoutOneTimeRequest {
  @IsNotEmpty()
  @IsString()
  priceId: string;

  @IsNotEmpty()
  @IsString()
  successUrl: string;

  @IsNotEmpty()
  @IsString()
  cancelUrl: string;

  @IsNotEmpty()
  metadata: Record<string, string>;
}

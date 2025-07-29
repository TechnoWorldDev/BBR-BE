import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateResidenceSubscriptionCheckoutRequest {
  @ApiProperty({
    description: 'Residence ID to subscribe to',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsNotEmpty()
  @IsUUID()
  residenceId: string;

  @ApiProperty({
    description: 'Success URL for Stripe checkout',
    example: 'https://example.com/success'
  })
  @IsNotEmpty()
  @IsString()
  successUrl: string;

  @ApiProperty({
    description: 'Cancel URL for Stripe checkout',
    example: 'https://example.com/cancel'
  })
  @IsNotEmpty()
  @IsString()
  cancelUrl: string;
}
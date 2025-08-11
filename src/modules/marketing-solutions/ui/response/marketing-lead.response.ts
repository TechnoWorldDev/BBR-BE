import { ApiProperty } from '@nestjs/swagger';

export class MarketingLeadResponse {
  @ApiProperty({
    description: 'User information',
  })
  user: {
    id: string;
    email: string;
    fullName: string;
    status: string;
    emailVerified: boolean;
  };

  @ApiProperty({
    description: 'Residence information (if created)',
    required: false,
  })
  residence?: {
    id: string;
    name: string;
    slug: string;
    status: string;
    developmentStatus: string;
  };

  @ApiProperty({
    description: 'Whether a password reset email was sent',
  })
  passwordResetEmailSent: boolean;

  @ApiProperty({
    description: 'Whether this is a new user',
  })
  isNewUser: boolean;

  @ApiProperty({
    description: 'Whether a new residence was created',
  })
  isNewResidence: boolean;
} 
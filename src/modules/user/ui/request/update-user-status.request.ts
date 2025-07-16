import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserStatusEnum } from 'src/shared/types/user-status.enum';

export class UpdateUserStatusRequest {
  @IsNotEmpty()
  @IsEnum(UserStatusEnum)
  status: UserStatusEnum;
}

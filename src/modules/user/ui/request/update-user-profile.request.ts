import { IsOptional, IsString, IsUUID, IsNumber, IsArray, IsBoolean } from 'class-validator';

export class UpdateUserProfileRequest {
  @IsOptional() @IsString() fullName?: string;
  @IsOptional() @IsString() phoneNumber?: string;
  @IsOptional() @IsString() phoneNumberCountryCode?: string;
  @IsOptional() @IsString() imageId?: string;
  @IsOptional() @IsUUID() currentLocation?: string;
  @IsOptional() @IsString() preferredContactMethod?: string;
  @IsOptional() @IsUUID() preferredResidenceLocation?: string;
  @IsOptional() @IsNumber() budgetRangeFrom?: number;
  @IsOptional() @IsNumber() budgetRangeTo?: number;
  @IsOptional() @IsArray() @IsUUID('all', { each: true }) unitTypes?: string[];
  @IsOptional() @IsArray() @IsUUID('all', { each: true }) lifestyles?: string[];
  @IsOptional() @IsBoolean() receiveLuxuryInsights?: boolean;
  @IsOptional() @IsBoolean() notifyLatestNews?: boolean;
  @IsOptional() @IsBoolean() notifyBlogs?: boolean;
  @IsOptional() @IsBoolean() notifyMarketTrends?: boolean;
  @IsOptional() @IsBoolean() pushNotifications?: boolean;
  @IsOptional() @IsBoolean() emailNotifications?: boolean;
}

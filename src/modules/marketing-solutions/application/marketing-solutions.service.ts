import { Injectable } from '@nestjs/common';
import { User } from '../../user/domain/user.entity';
import { Residence } from '../../residentmanagement/residence/domain/residence.entity';
import { UserStatusEnum } from '../../../shared/types/user-status.enum';
import { SignupMethodEnum } from '../../../shared/types/signup-method.enum';
import { RequestResetPasswordCommand } from '../../auth/application/commands/request-reset-password.command';
import { RequestPasswordCommandHandler } from '../../auth/application/handlers/request-password.command.handler';
import { IRoleRepository } from '../../role/domain/role.repository.interface';
import { IUserRepository } from '../../user/domain/user.repository.interface';
import { ICompanyRepository } from '../../company/domain/company.repository.interface';
import { ResidenceStatusEnum } from '../../residentmanagement/residence/domain/residence-status.enum';
import { DevelopmentStatusEnum } from '../../../shared/types/development-status.enum';
import { v4 as uuidv4 } from 'uuid';

export interface MarketingLeadData {
  name: string;
  phoneNumber: string;
  email: string;
  companyName: string;
  brandedResidenceName: string;
  companyWebsite?: string;
}

@Injectable()
export class MarketingSolutionsService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly roleRepository: IRoleRepository,
    private readonly companyRepository: ICompanyRepository,
    private readonly requestPasswordCommandHandler: RequestPasswordCommandHandler
  ) {}

  async processMarketingLead(
    data: MarketingLeadData
  ): Promise<{ user: User; residence?: Residence }> {
    // Check if user exists
    let user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      // Create new user without password-
      const developerRole = await this.roleRepository.findByName('developer');
      if (!developerRole) {
        throw new Error('Developer role not found');
      }

      // Check if company already exists with same contact person email and name
      let company = await this.companyRepository.findByContactPersonEmailAndName(
        data.email,
        data.companyName
      );

      // Create company if it doesn't exist
      if (!company) {
        company = await this.companyRepository.create({
          name: data.companyName,
          website: data.companyWebsite,
          address: '',
          phoneNumber: data.phoneNumber,
          phoneNumberCountryCode: '+1', // Default to +1, could be extracted from phone number
          contactPersonFullName: data.name,
          contactPersonEmail: data.email,
          contactPersonPhoneNumber: data.phoneNumber,
          contactPersonPhoneNumberCountryCode: '+1',
        });
      }

      const newUser: Partial<User> = {
        email: data.email,
        fullName: data.name,
        password: '', // No password initially
        signupMethod: SignupMethodEnum.EMAIL,
        status: UserStatusEnum.INACTIVE,
        roleId: developerRole.id,
        emailVerified: false,
        agreedTerms: false,
        receiveLuxuryInsights: false,
        notifyLatestNews: false,
        notifyMarketTrends: false,
        notifyBlogs: false,
        pushNotifications: false,
        emailNotifications: true,
        company: company,
      };

      const createdUser = await this.userRepository.create(newUser);
      if (!createdUser) {
        throw new Error('Failed to create user');
      }
      user = createdUser;

      // Send "Set Your Password" email using forgot password flow
      await this.requestPasswordCommandHandler.handle(new RequestResetPasswordCommand(data.email));
    }

    if (!user) {
      throw new Error('Failed to create or find user');
    }

    // Check if residence exists for this user
    let residence: Residence | undefined;

    // Always create a residence for new users (regardless of company)
    if (!user.company) {
      // Check if company already exists with same contact person email and name
      let company = await this.companyRepository.findByContactPersonEmailAndName(
        data.email,
        data.companyName
      );

      // Create company if it doesn't exist
      if (!company) {
        company = await this.companyRepository.create({
          name: data.companyName,
          website: data.companyWebsite,
          address: '',
          phoneNumber: data.phoneNumber,
          phoneNumberCountryCode: '+1',
          contactPersonFullName: data.name,
          contactPersonEmail: data.email,
          contactPersonPhoneNumber: data.phoneNumber,
          contactPersonPhoneNumberCountryCode: '+1',
        });
      }

      // Update user with company
      await this.userRepository.update(user.id, { company: company });
      user.company = company;
    }

    // Check if user's company already has a residence
    if (user.company) {
      residence = await Residence.query()
        .where('companyId', user.company.id)
        .whereNull('deletedAt')
        .first();
    }

    // If no residence exists, create a basic one
    if (!residence && user.company) {
      // Get default country (US) and city for the residence
      const defaultCountry = await this.getDefaultCountry();
      if (!defaultCountry) {
        throw new Error('Default country not found');
      }
      const defaultCity = await this.getDefaultCity(defaultCountry.id);
      const defaultBrand = await this.getDefaultBrand();

      if (defaultCity && defaultBrand) {
        const newResidence: Partial<Residence> = {
          name: data.brandedResidenceName,
          slug: data.brandedResidenceName.toLowerCase().replace(/\s+/g, '-'),
          status: ResidenceStatusEnum.DRAFT,
          developmentStatus: DevelopmentStatusEnum.PLANNED,
          subtitle: 'Your branded residence',
          description: 'A premium branded residence for affluent buyers',
          budgetStartRange: 500000,
          budgetEndRange: 2000000,
          address: '',
          longitude: '0.0',
          latitude: '0.0',
          yearBuilt: new Date().getFullYear().toString(),
          floorSqft: 0,
          staffRatio: 0,
          petFriendly: true,
          disabledFriendly: true,
          countryId: defaultCountry.id,
          cityId: defaultCity.id,
          brandId: defaultBrand.id,
          companyId: user.company.id,
        };

        residence = await Residence.create(newResidence);
      }
    }

    return { user, residence };
  }

  private async getDefaultCountry() {
    // Try to get US as default country
    const { Country } = await import('../../shared/country/domain/country.entity');
    return await Country.query().where('code', 'US').first();
  }

  private async getDefaultCity(countryId: string) {
    // Try to get a major city from the default country
    const { City } = await import('../../shared/city/domain/city.entity');
    return await City.query().where('countryId', countryId).orderBy('population', 'desc').first();
  }

  private async getDefaultBrand() {
    // Try to get the first available brand
    const { Brand } = await import('../../brand/domain/brand.entity');
    return await Brand.query().first();
  }
}

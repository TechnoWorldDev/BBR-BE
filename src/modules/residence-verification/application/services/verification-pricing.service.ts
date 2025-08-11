import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { VerificationTypeEnum } from '../../domain/verification-type.enum';
import { IVerificationPricingRepository } from '../../domain/verification-pricing.repository.interface';
import { VerificationPricing } from '../../domain/verification-pricing.entity';

@Injectable()
export class VerificationPricingService {
  constructor(
    @Inject('IVerificationPricingRepository')
    private readonly verificationPricingRepository: IVerificationPricingRepository,
  ) {}

  async getPricing(verificationType: VerificationTypeEnum): Promise<{
    price: number;
    currency: string;
    description: string;
  }> {
    const pricing = await this.verificationPricingRepository.findByType(verificationType);
    
    if (!pricing) {
      throw new NotFoundException(`Pricing not found for verification type: ${verificationType}`);
    }

    return {
      price: pricing.price,
      currency: pricing.currency,
      description: pricing.description || `${verificationType} Residence Verification`,
    };
  }

  async getPrice(verificationType: VerificationTypeEnum): Promise<number> {
    const pricing = await this.getPricing(verificationType);
    return pricing.price;
  }

  async getCurrency(verificationType: VerificationTypeEnum): Promise<string> {
    const pricing = await this.getPricing(verificationType);
    return pricing.currency;
  }

  async getDescription(verificationType: VerificationTypeEnum): Promise<string> {
    const pricing = await this.getPricing(verificationType);
    return pricing.description;
  }

  async getAllPricing(): Promise<VerificationPricing[]> {
    return await this.verificationPricingRepository.findAllActive();
  }

  async getPricingMap(): Promise<{
    [key: string]: {
      price: number;
      currency: string;
      description: string;
    };
  }> {
    const allPricing = await this.verificationPricingRepository.findAllActive();
    
    const pricingMap: {
      [key: string]: {
        price: number;
        currency: string;
        description: string;
      };
    } = {};

    allPricing.forEach(pricing => {
      pricingMap[pricing.verificationType] = {
        price: pricing.price,
        currency: pricing.currency,
        description: pricing.description || `${pricing.verificationType} Residence Verification`,
      };
    });

    return pricingMap;
  }
}

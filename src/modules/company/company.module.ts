import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';
import { ICompanyRepository } from './domain/company.repository.interface';
import { CompanyRepository } from './infrastructure/company.repository';
import { CompanyController } from './ui/company.controller';
import { DeleteCompanyCommandHandler } from './application/handlers/delete-company.command.handler';
import { UpdateCompanyCommandHandler } from './application/handlers/update-company.command.handler';
import { UpdateCompanyProfileCommandHandler } from './application/handlers/update-company-profile.command.handler';
import { MediaModule } from '../media/media.module';
import { FetchAllCompanyQueryHandler } from './application/query/fetch-all-company.query.handler';
import { FindByIdCompanyQueryHandler } from './application/query/find-by-id-company.query.handler';

@Module({
  imports: [DatabaseModule, MediaModule],
  controllers: [CompanyController],
  providers: [
    {
      provide: ICompanyRepository,
      useClass: CompanyRepository,
    },
    FetchAllCompanyQueryHandler,
    FindByIdCompanyQueryHandler,
    DeleteCompanyCommandHandler,
    UpdateCompanyCommandHandler,
    UpdateCompanyProfileCommandHandler,
  ],
})
export class CompanyModule {}

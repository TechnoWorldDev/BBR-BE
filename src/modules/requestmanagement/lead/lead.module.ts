import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';
import { ILeadRepository } from './domain/ilead.repository.interface';
import { UpdateLeadCommandHandler } from './application/handler/update-lead.command.handler';
import { DeleteLeadCommandHandler } from './application/handler/delete-lead.command.handler';
import { FindLeadByIdCommandQuery } from './application/query/find-lead-by-id.command.query';
import { FetchLeadsCommandQuery } from './application/query/fetch-leads.command.query';
import { LeadController } from './ui/lead.controller';
import { LeadMapper } from './ui/mapper/lead.mapper';
import { LeadRepositoryImpl } from './infrastructure/lead.repository.impl';
import { CreateLeadCommandHandler } from './application/handler/create-lead-command.handler';
import { UpdateLeadStatusCommandHandler } from './application/handler/update-lead-status.command.handler';

@Module({
  imports: [DatabaseModule],
  controllers: [LeadController],
  providers: [
    {
      provide: ILeadRepository,
      useClass: LeadRepositoryImpl,
    },
    CreateLeadCommandHandler,
    UpdateLeadCommandHandler,
    UpdateLeadStatusCommandHandler,
    DeleteLeadCommandHandler,
    FindLeadByIdCommandQuery,
    FetchLeadsCommandQuery,
    LeadMapper,
  ],
})
export class LeadModule {}

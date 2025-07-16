import { Module } from '@nestjs/common';
import { UnitTypeController } from './ui/unit-type.controller';
import { CreateUnitTypeCommandHandler } from './application/handler/create-unit-type.command.handler';
import { DeleteUnitTypeCommandHandler } from './application/handler/delete-unit-type.command.handler';
import { UpdateUnitTypeCommandHandler } from './application/handler/update-unit-type.command.handler';
import { FetchUnitTypesQueryHandler } from './application/query/fetch-unit-types.query.handler';
import { FindByIdUnitTypeQueryHandler } from './application/query/find-by-id-unit-type.query.handler';
import { IUnitTypeRepository } from './domain/unit-type.repository.interface';
import { UnitTypeRepositoryImpl } from './infrastructure/unit-type.repository';

@Module({
  imports: [],
  controllers: [UnitTypeController],
  providers: [
    {
      provide: IUnitTypeRepository,
      useClass: UnitTypeRepositoryImpl,
    },
    FetchUnitTypesQueryHandler,
    FindByIdUnitTypeQueryHandler,
    CreateUnitTypeCommandHandler,
    UpdateUnitTypeCommandHandler,
    DeleteUnitTypeCommandHandler,
  ],
  exports: [],
})
export class UnitTypeModule {}

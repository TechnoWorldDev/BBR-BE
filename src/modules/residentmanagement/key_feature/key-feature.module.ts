import { Delete, Module } from '@nestjs/common';
import { KeyFeatureController } from './ui/key-feature.controller';
import { FindAllKeyFeaturesQueryHandler } from './application/query/find-all-key-features.query.handler';
import { IKeyFeatureRepository } from './domain/key-feature.repository.interface';
import { KeyFeatureRepository } from './infrastructure/key-feature.repository';
import { FindByIdKeyFeatureQueryHandler } from './application/query/find-by-id-key-feature.query.handler';
import { CreateKeyFeatureCommandHandler } from './application/handlers/create-key-feature.command.handler';
import { UpdateKeyFeatureCommandHandler } from './application/handlers/update-key-feature.command.handler';
import { DeleteKeyFeatureCommandHandler } from './application/handlers/delete-key-feature.command.handler';

@Module({
  controllers: [KeyFeatureController],
  providers: [
    {
      provide: IKeyFeatureRepository,
      useClass: KeyFeatureRepository,
    },
    FindAllKeyFeaturesQueryHandler,
    FindByIdKeyFeatureQueryHandler,
    CreateKeyFeatureCommandHandler,
    UpdateKeyFeatureCommandHandler,
    DeleteKeyFeatureCommandHandler,
  ],
  exports: [],
})
export class KeyFeatureModule {}

import { Module } from '@nestjs/common';
import { FactionsService } from './factions.service';
import { FactionsController } from './factions.controller';

@Module({
  controllers: [FactionsController],
  providers: [FactionsService]
})
export class FactionsModule {}

import { Module } from '@nestjs/common';

import { ConfigModule } from '@app/config';

import { TemporalClientService } from './temporal-client.service';

@Module({
  imports: [ConfigModule],
  providers: [TemporalClientService],
  exports: [TemporalClientService],
})
export class TemporalClientModule {}

import { Module } from '@nestjs/common';

import { ConfigModule } from '@app/config';

import { TemporalWorkerService } from './temporal-worker.service';

@Module({
  imports: [ConfigModule],
  providers: [TemporalWorkerService],
  exports: [TemporalWorkerService],
})
export class TemporalWorkerModule {}

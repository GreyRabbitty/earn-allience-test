import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule } from '@app/config';
import { DatabaseModule } from '@app/database';
import { LoggingModule } from '@app/logging';
import { TemporalClientModule, TemporalWorkerModule } from '@app/temporal';

import dbConfig from './config/database';
import temporalConfig from './config/temporal';
import { MediaApisService } from './services/media-apis.service';
import { MediaWallPostCommand } from './media-wall-post-worker.command';

@Module({
  imports: [
    ConfigModule,
    ConfigModule.forRoot({
      load: [dbConfig, temporalConfig],
    }),
    TemporalWorkerModule,
    TemporalClientModule,
    DatabaseModule,
    LoggingModule.forRoot(),
    TypeOrmModule.forFeature(dbConfig().entities),
  ],
  providers: [MediaWallPostCommand, MediaApisService],
})
export class MediaWallPostWorkerModule {}

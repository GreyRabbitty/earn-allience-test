import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule } from '@app/config';
import { DatabaseModule } from '@app/database';
import { LoggingModule } from '@app/logging';
import { TemporalWorkerModule } from '@app/temporal';

import dbConfig from './config/database';
import temporalConfig from './config/temporal';
import { WallPostCommand } from './wall-post.command';

@Module({
  imports: [
    ConfigModule,
    ConfigModule.forRoot({
      load: [temporalConfig, dbConfig],
    }),
    TemporalWorkerModule,
    DatabaseModule,
    LoggingModule.forRoot(),
    TypeOrmModule.forFeature(dbConfig().entities),
  ],
  providers: [WallPostCommand],
})
export class WallPostWorkerModule {}

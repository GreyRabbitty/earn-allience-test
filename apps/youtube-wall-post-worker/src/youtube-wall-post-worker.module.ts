import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule } from '@app/config';
import { DatabaseModule } from '@app/database';
import { LoggingModule } from '@app/logging';
import { TemporalClientModule, TemporalWorkerModule } from '@app/temporal';

import dbConfig from './config/database';
import temporalConfig from './config/temporal';
import youtubeConfig from './config/youtube';
import { YoutubeApisService } from './services/youtube-apis.service';
import { YoutubeWallPostCommand } from './youtube-wall-post.command';

@Module({
  imports: [
    ConfigModule,
    ConfigModule.forRoot({
      load: [temporalConfig, dbConfig, youtubeConfig],
    }),
    TemporalWorkerModule,
    TemporalClientModule,
    DatabaseModule,
    LoggingModule.forRoot(),
    TypeOrmModule.forFeature(dbConfig().entities),
  ],
  providers: [YoutubeWallPostCommand, YoutubeApisService],
})
export class YoutubeWallPostWorkerModule {}

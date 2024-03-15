import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule } from '@app/config';
import { DatabaseModule } from '@app/database';
import { LoggingModule } from '@app/logging';
import { TemporalClientModule, TemporalWorkerModule } from '@app/temporal';

import dbConfig from './config/database';
import temporalConfig from './config/temporal';
import { GameTwitterApiService } from './services/game-twitter-apis.service';
import { GameFollowerListCommand } from './game-twitter-followers-worker.command';

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
  providers: [GameFollowerListCommand, GameTwitterApiService],
})
export class GameTwitterFollowerListModule {}

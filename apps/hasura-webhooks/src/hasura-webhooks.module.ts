import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DatabaseModule } from '@app/database';
import { LoggingModule } from '@app/logging';
import { TemporalClientModule } from '@app/temporal';

import dbConfig from './config/database';
import temporalConfig from './config/temporal';
import { WallPostsController, GameTwitterFollowersController } from './controllers/wall-posts.controller';
@Module({
  imports: [
    ConfigModule,
    ConfigModule.forRoot({
      load: [temporalConfig, dbConfig],
    }),
    DatabaseModule,
    TypeOrmModule.forFeature(dbConfig().entities),
    LoggingModule.forRoot(),
    TemporalClientModule,
  ],
  controllers: [WallPostsController, GameTwitterFollowersController],
  providers: [],
})
export class HasuraWebhooksModule {}

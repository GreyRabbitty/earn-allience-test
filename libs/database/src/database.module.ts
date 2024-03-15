import { Connector, IpAddressTypes } from '@google-cloud/cloud-sql-connector';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule, ConfigService } from '@app/config';

import { DatabaseService } from './database.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const instanceConnectionName: string =
          configService.get('database.instanceConnectionName') || null;

        // cloud sql connection
        if (instanceConnectionName) {
          const connector = new Connector();

          const clientOpts = await connector.getOptions({
            instanceConnectionName,
            ipType: IpAddressTypes.PRIVATE,
          });

          return {
            type: 'postgres',
            username: configService.get('database.user'),
            password: configService.get('database.pass'),
            database: configService.get('database.db'),
            entities: configService.get('database.entities'),
            extra: {
              ...clientOpts,
              max: +configService.get('database.maxPoolSize') || 10,
              lock_timeout: 3000,
              statement_timeout:
                +configService.get('database.statementTimeout') || 0,
            },
          };
        }

        // traditional connection
        return {
          type: 'postgres',
          host: configService.get('database.host'),
          port: +configService.get('database.port'),
          username: configService.get('database.user'),
          password: configService.get('database.pass'),
          database: configService.get('database.db'),
          entities: configService.get('database.entities'),
          extra: {
            max: +configService.get('database.maxPoolSize') || 10,
            lock_timeout: 3000,
            statement_timeout:
              +configService.get('database.statementTimeout') || 0,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [DatabaseService],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}

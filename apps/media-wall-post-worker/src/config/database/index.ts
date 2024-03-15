import { registerAs } from '@nestjs/config';

import { RssFeeds, WallPost, WallPostRawData } from '@app/database/entities';

export default registerAs('database', () => ({
  instanceConnectionName: process.env.POSTGRES_INSTANCE_CONNECTION_NAME,
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  user: process.env.POSTGRES_USER,
  pass: process.env.POSTGRES_PASSWORD,
  db: process.env.POSTGRES_DBNAME,
  entities: [RssFeeds, WallPost, WallPostRawData],
  maxPoolSize: parseInt(process.env.POSTGRES_MAX_POOL_SIZE),
}));

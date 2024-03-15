import { DataSource } from 'typeorm';

export interface BaseActivityDependencies {
  db: DataSource;
}

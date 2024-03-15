import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { IRssFeeds } from '../interfaces';

@Entity('rss_feeds')
export class RssFeeds implements IRssFeeds {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: string;

  @Column({ name: 'feed_type' })
  feedType: string;

  @Column({ name: 'feed_url' })
  feedUrl: string;

  @Column({ name: 'last_synced_at' })
  lastSyncedAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;
}

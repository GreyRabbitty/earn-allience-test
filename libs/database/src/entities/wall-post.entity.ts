import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { IWallPost } from '../interfaces';

@Entity('wall_posts')
export class WallPost implements IWallPost {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: string;

  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'description' })
  description: string;

  @Column({ name: 'assets', type: 'jsonb' })
  assets: any[];

  @Column({ name: 'source_type' })
  sourceType: string;

  @Column({ name: 'game_id', nullable: true })
  gameId: string;

  @Column({ name: 'score' })
  score: number;

  @Column({
    name: 'posted_at',
    type: 'timestamp with time zone',
  })
  postedAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;
}

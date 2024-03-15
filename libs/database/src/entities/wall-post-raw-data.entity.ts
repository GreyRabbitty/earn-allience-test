import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { IWallPostRawData } from '../interfaces';

@Entity('wall_post_raw_data')
export class WallPostRawData implements IWallPostRawData {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: string;

  @Column({ name: 'wall_post_id', type: 'uuid' })
  wallPostId: string;

  @Column({ name: 'source_type' })
  sourceType: string;

  @Column({ name: 'source_id' })
  sourceId: string;

  @Column({ name: 'data', type: 'jsonb' })
  data: any;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;
}

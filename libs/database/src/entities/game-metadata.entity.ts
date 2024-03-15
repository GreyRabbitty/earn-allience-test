import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Game } from '@app/database/entities/game.entity';

@Entity('game_metadata')
export class GameMetadata {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: string;

  @Column({ name: 'game_id' })
  gameId: string;

  @Column({ name: 'meta_key' })
  metaKey: string;

  @Column({ name: 'meta_value' })
  metaValue: string;

  @Column({ name: 'meta_type' })
  metaType: string;

  @ManyToOne(() => Game, (game) => game.metadata)
  @JoinColumn({ name: 'game_id' })
  game: Game;
}

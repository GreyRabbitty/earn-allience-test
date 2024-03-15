import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { GameMetadata } from '@app/database/entities/game-metadata.entity';
import { IGame } from '@app/database/interfaces';

@Entity('games')
export class Game implements IGame {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: string;

  @Column({ name: 'name' })
  name: string;

  @OneToMany(() => GameMetadata, (gameMetadata) => gameMetadata.game)
  metadata: GameMetadata[];
}

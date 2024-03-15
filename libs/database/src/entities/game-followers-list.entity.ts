import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
  } from 'typeorm';
  
  
  @Entity('game_followers_list')
  export class GameFollowersList {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: string;
  
    @Column({ name: 'game_id' })
    gameId: string;
  
    @Column({ name: 'count' })
    count: number;
  
    @Column({ name: 'recent_list' })
    recentList: string[];
  
    @Column({ name: 'new_list' })
    newList: string[];

    @Column({ name: 'removed_list' })
    removedList: string[];
  }
  
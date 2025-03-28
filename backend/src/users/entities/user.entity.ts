import { GameSession } from 'src/game-sessions/entities/game-session.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @ApiProperty({ example: 1, description: 'Unique identifier for the user' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'johndoe', description: 'Unique username of the user' })
  @Column({ unique: true })
  username: string;

  @ApiProperty({ example: 'johndoe@example.com', description: 'Unique email of the user' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ example: 'hashedpassword123', description: 'User password (hashed)' })
  @Column()
  password: string; // hashed

  @ApiProperty({ example: '0x1234abcd...', description: 'User wallet address', nullable: true })
  @Column({ nullable: true })
  walletAddress: string;

  @ApiProperty({ example: '2025-03-27T12:00:00.000Z', description: 'Timestamp when the user was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: '2025-03-27T12:30:00.000Z', description: 'Timestamp when the user was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    type: () => [GameSession],
    description: 'List of game sessions associated with the user',
    required: false,
  })
  @OneToMany(() => GameSession, (gameSession) => gameSession.user)
  gameSessions?: GameSession[];
}

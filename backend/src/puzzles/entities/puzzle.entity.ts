import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
} from 'typeorm';
import { Step } from '../../steps/entities/step.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum PuzzleDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}
@Entity()
export class Puzzle {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'The unique identifier of the puzzle' })
  id: number;

  @Column()
  @ApiProperty({ description: 'The title of the puzzle' })
  title: string;

  @Column('text')
  @ApiProperty({ description: 'A detailed description of the puzzle' })
  description: string;

  @Column({
    type: 'enum',
    enum: PuzzleDifficulty,
    default: PuzzleDifficulty.EASY,
  })
  @ApiProperty({
    description: 'The difficulty level of the puzzle',
    example: PuzzleDifficulty.EASY,
  })
  difficulty: PuzzleDifficulty;

  @Column()
  @ApiProperty({
    description: 'The category of the puzzle',
    example: 'sport',
  })
  category: string;

  @Column()
  @ApiProperty({
    description: 'The points awarded for completing the puzzle',
    example: 100,
  })
  points: number;

  @Column({ type: 'jsonb', nullable: true })
  @ApiProperty({
    description: 'Additional information related to the puzzle',
    example: { type: 'image', url: 'https://example.com/puzzle-image.jpg' },
  })
  metadata: Record<string, any>;

  @OneToMany(() => Step, (step) => step.puzzle)
  @ApiProperty({
    description: 'The steps associated with the puzzle',
    type: () => [Step],
  })
  steps: Step[];
}

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('user_progress')
export class UserProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'quiz_id' })
  quizId: string;

  @Column({ type: 'json' })
  answers: any[];

  @Column({ default: false })
  completed: boolean;

  @Column({ type: 'float', nullable: true })
  score: number | null;

  @Column({ name: 'last_updated' })
  lastUpdated: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('offline_downloads')
export class OfflineDownload {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'quiz_id' })
  quizId: string;

  @Column({ name: 'downloaded_at' })
  downloadedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
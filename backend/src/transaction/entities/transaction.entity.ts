import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @Column()
  amount: number;

  @Column()
  type: 'deposit' | 'withdrawal' | 'purchase';

  @Column()
  status: 'pending' | 'completed' | 'failed';

  @CreateDateColumn()
  createdAt: Date;
}


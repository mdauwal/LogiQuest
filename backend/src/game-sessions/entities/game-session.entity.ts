import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { User } from "../../users/entities/user.entity"
import { Chain } from "../../chains/entities/chain.entity"

@Entity()
export class GameSession {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User)
  user: User

  @ManyToOne(() => Chain)
  chain: Chain

  @Column()
  currentStep: number

  @Column()
  score: number

  @Column({ type: "enum", enum: ["active", "completed", "abandoned"] })
  status: "active" | "completed" | "abandoned"

  @Column()
  attempts: number

  @CreateDateColumn()
  startTime: Date

  @UpdateDateColumn()
  lastActive: Date
}


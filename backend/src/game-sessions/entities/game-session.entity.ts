import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User"; 
import { Puzzle } from "./Puzzle"; 

@Entity() 
export class GameSession {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    user: User;

    @ManyToOne(() => Puzzle)
    puzzle: Puzzle;

    @Column()
    currentStep: number;

    @Column()
    score: number;

    @Column({ type: "enum", enum: ["active", "completed", "abandoned"] }) 
    status: "active" | "completed" | "abandoned";

    @Column()
    attempts: number;

    @CreateDateColumn()
    startedAt: Date;

    @UpdateDateColumn()
    lastActive: Date;
}

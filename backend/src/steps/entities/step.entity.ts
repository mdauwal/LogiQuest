import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Puzzle } from '../puzzles/puzzle.entity';

@Entity()
export class Step {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;

    @Column()
    order: number;

    @Column('simple-array', { nullable: true })
    hints: string[];

    @ManyToOne(() => Puzzle, puzzle => puzzle.steps)
    puzzle: Puzzle;
}


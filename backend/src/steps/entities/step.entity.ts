import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Puzzle } from "../../puzzles/entities/puzzle.entity";
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Step {
    @ApiProperty({
        type: 'number',
        description: 'Unique identifier for the step',
    })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({
        type: 'string',
        description: 'Description of the step',
    })
    @Column()
    description: string;

    @ApiProperty({
        type: 'number',
        description: 'Order of the step in the LogiQuest',
    })
    @Column()
    order: number;

    @ApiProperty({
        type: 'array',
        description: 'Hints for solving the step',
        items: { type: 'string' },
    })
    @Column('simple-array', { nullable: true })
    hints: string[];

    @ManyToOne(() => Puzzle, puzzle => puzzle.steps)
    puzzle: Puzzle;
}

